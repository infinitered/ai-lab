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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypointTracker = void 0;
var tracker_1 = require("./tracker");
/**
 * KeypointTracker, which tracks poses based on keypoint similarity. This
 * tracker assumes that keypoints are provided in normalized image
 * coordinates.
 */
var KeypointTracker = /** @class */ (function (_super) {
    __extends(KeypointTracker, _super);
    function KeypointTracker(config) {
        var _this = _super.call(this, config) || this;
        _this.keypointThreshold =
            config.keypointTrackerParams.keypointConfidenceThreshold;
        _this.keypointFalloff = config.keypointTrackerParams.keypointFalloff;
        _this.minNumKeyoints = config.keypointTrackerParams.minNumberOfKeypoints;
        return _this;
    }
    /**
     * Computes similarity based on Object Keypoint Similarity (OKS). It's
     * assumed that the keypoints within each `Pose` are in normalized image
     * coordinates. See `Tracker` for more details.
     */
    KeypointTracker.prototype.computeSimilarity = function (poses) {
        if (poses.length === 0 || this.tracks.length === 0) {
            return [[]];
        }
        var simMatrix = [];
        for (var _i = 0, poses_1 = poses; _i < poses_1.length; _i++) {
            var pose = poses_1[_i];
            var row = [];
            for (var _a = 0, _b = this.tracks; _a < _b.length; _a++) {
                var track = _b[_a];
                row.push(this.oks(pose, track));
            }
            simMatrix.push(row);
        }
        return simMatrix;
    };
    /**
     * Computes the Object Keypoint Similarity (OKS) between a pose and track.
     * This is similar in spirit to the calculation used by COCO keypoint eval:
     * https://cocodataset.org/#keypoints-eval
     * In this case, OKS is calculated as:
     * (1/sum_i d(c_i, c_ti)) * \sum_i exp(-d_i^2/(2*a_ti*x_i^2))*d(c_i, c_ti)
     * where
     *   d(x, y) is an indicator function which only produces 1 if x and y
     *     exceed a given threshold (i.e. keypointThreshold), otherwise 0.
     *   c_i is the confidence of keypoint i from the new pose
     *   c_ti is the confidence of keypoint i from the track
     *   d_i is the Euclidean distance between the pose and track keypoint
     *   a_ti is the area of the track object (the box covering the keypoints)
     *   x_i is a constant that controls falloff in a Gaussian distribution,
     *    computed as 2*keypointFalloff[i].
     * @param pose A `Pose`.
     * @param track A `Track`.
     * @returns The OKS score between the pose and the track. This number is
     * between 0 and 1, and larger values indicate more keypoint similarity.
     */
    KeypointTracker.prototype.oks = function (pose, track) {
        var boxArea = this.area(track.keypoints) + 1e-6;
        var oksTotal = 0;
        var numValidKeypoints = 0;
        for (var i = 0; i < pose.keypoints.length; ++i) {
            var poseKpt = pose.keypoints[i];
            var trackKpt = track.keypoints[i];
            if (poseKpt.score < this.keypointThreshold ||
                trackKpt.score < this.keypointThreshold) {
                continue;
            }
            numValidKeypoints += 1;
            var dSquared = Math.pow(poseKpt.x - trackKpt.x, 2) +
                Math.pow(poseKpt.y - trackKpt.y, 2);
            var x = 2 * this.keypointFalloff[i];
            oksTotal += Math.exp(-1 * dSquared / (2 * boxArea * Math.pow(x, 2)));
        }
        if (numValidKeypoints < this.minNumKeyoints) {
            return 0.0;
        }
        return oksTotal / numValidKeypoints;
    };
    /**
     * Computes the area of a bounding box that tightly covers keypoints.
     * @param Keypoint[] An array of `Keypoint`s.
     * @returns The area of the object.
     */
    KeypointTracker.prototype.area = function (keypoints) {
        var _this = this;
        var validKeypoint = keypoints.filter(function (kpt) { return kpt.score > _this.keypointThreshold; });
        var minX = Math.min.apply(Math, __spreadArrays([1.0], validKeypoint.map(function (kpt) { return kpt.x; })));
        var maxX = Math.max.apply(Math, __spreadArrays([0.0], validKeypoint.map(function (kpt) { return kpt.x; })));
        var minY = Math.min.apply(Math, __spreadArrays([1.0], validKeypoint.map(function (kpt) { return kpt.y; })));
        var maxY = Math.max.apply(Math, __spreadArrays([0.0], validKeypoint.map(function (kpt) { return kpt.y; })));
        return (maxX - minX) * (maxY - minY);
    };
    return KeypointTracker;
}(tracker_1.Tracker));
exports.KeypointTracker = KeypointTracker;
//# sourceMappingURL=keypoint_tracker.js.map