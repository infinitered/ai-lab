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
import { MoveNetEstimationConfig, MoveNetModelConfig } from './types';
export declare const SINGLEPOSE_LIGHTNING = "SinglePose.Lightning";
export declare const SINGLEPOSE_THUNDER = "SinglePose.Thunder";
export declare const MULTIPOSE_LIGHTNING = "MultiPose.Lightning";
export declare const VALID_MODELS: string[];
export declare const MOVENET_SINGLEPOSE_LIGHTNING_URL = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4";
export declare const MOVENET_SINGLEPOSE_THUNDER_URL = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4";
export declare const MOVENET_MULTIPOSE_LIGHTNING_URL = "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1";
export declare const MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = 192;
export declare const MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = 256;
export declare const MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = 256;
export declare const MOVENET_CONFIG: MoveNetModelConfig;
export declare const MOVENET_ESTIMATION_CONFIG: MoveNetEstimationConfig;
export declare const KEYPOINT_FILTER_CONFIG: {
    frequency: number;
    minCutOff: number;
    beta: number;
    derivateCutOff: number;
    thresholdCutOff: number;
    thresholdBeta: number;
    disableValueScaling: boolean;
};
export declare const CROP_FILTER_ALPHA = 0.9;
export declare const MIN_CROP_KEYPOINT_SCORE = 0.2;
export declare const DEFAULT_MIN_POSE_SCORE = 0.25;
export declare const NUM_KEYPOINTS = 17;
export declare const NUM_KEYPOINT_VALUES = 3;
export declare const MULTIPOSE_BOX_SIZE = 5;
export declare const MULTIPOSE_BOX_IDX: number;
export declare const MULTIPOSE_BOX_SCORE_IDX: number;
export declare const MULTIPOSE_INSTANCE_SIZE: number;
export declare const DEFAULT_KEYPOINT_TRACKER_CONFIG: {
    maxTracks: number;
    maxAge: number;
    minSimilarity: number;
    keypointTrackerParams: {
        keypointConfidenceThreshold: number;
        keypointFalloff: number[];
        minNumberOfKeypoints: number;
    };
};
export declare const DEFAULT_BOUNDING_BOX_TRACKER_CONFIG: {
    maxTracks: number;
    maxAge: number;
    minSimilarity: number;
    trackerParams: {};
};
