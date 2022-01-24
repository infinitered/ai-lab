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
import { Pose } from '../types';
import { Track } from './interfaces/common_interfaces';
import { TrackerConfig } from './interfaces/config_interfaces';
/**
 * A stateful tracker for associating detections between frames. This is an
 * abstract base class that performs generic mechanics. Implementations must
 * inherit from this class.
 */
export declare abstract class Tracker {
    protected tracks: Track[];
    private readonly maxTracks;
    private readonly maxAge;
    private readonly minSimilarity;
    private nextID;
    constructor(config: TrackerConfig);
    /**
     * Tracks person instances across frames based on detections.
     * @param poses An array of detected `Pose`s.
     * @param timestamp The timestamp associated with the incoming poses, in
     * microseconds.
     * @returns An updated array of `Pose`s with tracking id properties.
     */
    apply(poses: Pose[], timestamp: number): Pose[];
    /**
     * Computes pairwise similarity scores between detections and tracks, based
     * on detected features.
     * @param poses An array of detected `Pose`s.
     * @returns A 2D array of shape [num_det, num_tracks] with pairwise
     * similarity scores between detections and tracks.
     */
    abstract computeSimilarity(poses: Pose[]): number[][];
    /**
     * Returns a copy of the stored tracks.
     */
    getTracks(): Track[];
    /**
     * Returns a Set of active track IDs.
     */
    getTrackIDs(): Set<number>;
    /**
     * Filters tracks based on their age.
     * @param timestamp The current timestamp in microseconds.
     */
    filterOldTracks(timestamp: number): void;
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
    assignTracks(poses: Pose[], simMatrix: number[][], timestamp: number): void;
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
    updateTracks(timestamp: number): void;
    /**
     * Creates a track from information in a pose.
     * @param pose A `Pose`.
     * @param timestamp The current timestamp in microseconds.
     * @param trackID The id to assign to the new track. If not provided,
     * will assign the next available id.
     * @returns A `Track`.
     */
    createTrack(pose: Pose, timestamp: number, trackID?: number): Track;
    /**
     * Returns the next free track ID.
     */
    nextTrackID(): number;
    /**
     * Removes specific tracks, based on their ids.
     */
    remove(...ids: number[]): void;
    /**
     * Resets tracks.
     */
    reset(): void;
}
