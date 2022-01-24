"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
var tracker_utils_1 = require("./tracker_utils");
/**
 * A stateful tracker for associating detections between frames. This is an
 * abstract base class that performs generic mechanics. Implementations must
 * inherit from this class.
 */
var Tracker = /** @class */ (function () {
    function Tracker(config) {
        tracker_utils_1.validateTrackerConfig(config);
        this.tracks = [];
        this.maxTracks = config.maxTracks;
        this.maxAge = config.maxAge * 1000; // Convert msec to usec.
        this.minSimilarity = config.minSimilarity;
        this.nextID = 1;
    }
    /**
     * Tracks person instances across frames based on detections.
     * @param poses An array of detected `Pose`s.
     * @param timestamp The timestamp associated with the incoming poses, in
     * microseconds.
     * @returns An updated array of `Pose`s with tracking id properties.
     */
    Tracker.prototype.apply = function (poses, timestamp) {
        this.filterOldTracks(timestamp);
        var simMatrix = this.computeSimilarity(poses);
        this.assignTracks(poses, simMatrix, timestamp);
        this.updateTracks(timestamp);
        return poses;
    };
    /**
     * Returns a copy of the stored tracks.
     */
    Tracker.prototype.getTracks = function () {
        return this.tracks.slice();
    };
    /**
     * Returns a Set of active track IDs.
     */
    Tracker.prototype.getTrackIDs = function () {
        return new Set(this.tracks.map(function (track) { return track.id; }));
    };
    /**
     * Filters tracks based on their age.
     * @param timestamp The current timestamp in microseconds.
     */
    Tracker.prototype.filterOldTracks = function (timestamp) {
        var _this = this;
        this.tracks = this.tracks.filter(function (track) {
            return timestamp - track.lastTimestamp <= _this.maxAge;
        });
    };
    /**
     * Performs a greedy optimization to link detections with tracks. The `poses`
     * array is updated in place by providing an `id` property. If incoming
     * detections are not linked with existing tracks, new tracks will be created.
     * @param poses An array of detected `Pose`s. It's assumed that poses are
     * sorted from most confident to least confident.
     * @param simMatrix A 2D array of shape [num_det, num_tracks] with pairwise
     * similarity scores between detections and tracks.
     * @param timestamp The current timestamp in microseconds.
     */
    Tracker.prototype.assignTracks = function (poses, simMatrix, timestamp) {
        var unmatchedTrackIndices = Array.from(Array(simMatrix[0].length).keys());
        var detectionIndices = Array.from(Array(poses.length).keys());
        var unmatchedDetectionIndices = [];
        for (var _i = 0, detectionIndices_1 = detectionIndices; _i < detectionIndices_1.length; _i++) {
            var detectionIndex = detectionIndices_1[_i];
            if (unmatchedTrackIndices.length === 0) {
                unmatchedDetectionIndices.push(detectionIndex);
                continue;
            }
            // Assign the detection to the track which produces the highest pairwise
            // similarity score, assuming the score exceeds the minimum similarity
            // threshold.
            var maxTrackIndex = -1;
            var maxSimilarity = -1;
            for (var _a = 0, unmatchedTrackIndices_1 = unmatchedTrackIndices; _a < unmatchedTrackIndices_1.length; _a++) {
                var trackIndex = unmatchedTrackIndices_1[_a];
                var similarity = simMatrix[detectionIndex][trackIndex];
                if (similarity >= this.minSimilarity && similarity > maxSimilarity) {
                    maxTrackIndex = trackIndex;
                    maxSimilarity = similarity;
                }
            }
            if (maxTrackIndex >= 0) {
                // Link the detection with the highest scoring track.
                var linkedTrack = this.tracks[maxTrackIndex];
                linkedTrack = Object.assign(linkedTrack, this.createTrack(poses[detectionIndex], timestamp, linkedTrack.id));
                poses[detectionIndex].id = linkedTrack.id;
                var index = unmatchedTrackIndices.indexOf(maxTrackIndex);
                unmatchedTrackIndices.splice(index, 1);
            }
            else {
                unmatchedDetectionIndices.push(detectionIndex);
            }
        }
        // Spawn new tracks for all unmatched detections.
        for (var _b = 0, unmatchedDetectionIndices_1 = unmatchedDetectionIndices; _b < unmatchedDetectionIndices_1.length; _b++) {
            var detectionIndex = unmatchedDetectionIndices_1[_b];
            var newTrack = this.createTrack(poses[detectionIndex], timestamp);
            this.tracks.push(newTrack);
            poses[detectionIndex].id = newTrack.id;
        }
    };
    /**
     * Updates the stored tracks in the tracker. Specifically, the following
     * operations are applied in order:
     * 1. Tracks are sorted based on freshness (i.e. the most recently linked
     *    tracks are placed at the beginning of the array and the most stale are
     *    at the end).
     * 2. The tracks array is sliced to only contain `maxTracks` tracks (i.e. the
     *    most fresh tracks).
     * @param timestamp The current timestamp in microseconds.
     */
    Tracker.prototype.updateTracks = function (timestamp) {
        // Sort tracks from most recent to most stale, and then only keep the top
        // `maxTracks` tracks.
        this.tracks.sort(function (ta, tb) { return tb.lastTimestamp - ta.lastTimestamp; });
        this.tracks = this.tracks.slice(0, this.maxTracks);
    };
    /**
     * Creates a track from information in a pose.
     * @param pose A `Pose`.
     * @param timestamp The current timestamp in microseconds.
     * @param trackID The id to assign to the new track. If not provided,
     * will assign the next available id.
     * @returns A `Track`.
     */
    Tracker.prototype.createTrack = function (pose, timestamp, trackID) {
        var track = {
            id: trackID || this.nextTrackID(),
            lastTimestamp: timestamp,
            keypoints: __spreadArrays(pose.keypoints).map(function (keypoint) { return (__assign({}, keypoint)); })
        };
        if (pose.box !== undefined) {
            track.box = __assign({}, pose.box);
        }
        return track;
    };
    /**
     * Returns the next free track ID.
     */
    Tracker.prototype.nextTrackID = function () {
        var nextID = this.nextID;
        this.nextID += 1;
        return nextID;
    };
    /**
     * Removes specific tracks, based on their ids.
     */
    Tracker.prototype.remove = function () {
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        this.tracks = this.tracks.filter(function (track) { return !ids.includes(track.id); });
    };
    /**
     * Resets tracks.
     */
    Tracker.prototype.reset = function () {
        this.tracks = [];
    };
    return Tracker;
}());
exports.Tracker = Tracker;
//# sourceMappingURL=tracker.js.map