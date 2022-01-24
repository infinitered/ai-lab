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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG = exports.DEFAULT_KEYPOINT_TRACKER_CONFIG = exports.MULTIPOSE_INSTANCE_SIZE = exports.MULTIPOSE_BOX_SCORE_IDX = exports.MULTIPOSE_BOX_IDX = exports.MULTIPOSE_BOX_SIZE = exports.NUM_KEYPOINT_VALUES = exports.NUM_KEYPOINTS = exports.DEFAULT_MIN_POSE_SCORE = exports.MIN_CROP_KEYPOINT_SCORE = exports.CROP_FILTER_ALPHA = exports.KEYPOINT_FILTER_CONFIG = exports.MOVENET_ESTIMATION_CONFIG = exports.MOVENET_CONFIG = exports.MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = exports.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = exports.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = exports.MOVENET_MULTIPOSE_LIGHTNING_URL = exports.MOVENET_SINGLEPOSE_THUNDER_URL = exports.MOVENET_SINGLEPOSE_LIGHTNING_URL = exports.VALID_MODELS = exports.MULTIPOSE_LIGHTNING = exports.SINGLEPOSE_THUNDER = exports.SINGLEPOSE_LIGHTNING = void 0;
exports.SINGLEPOSE_LIGHTNING = 'SinglePose.Lightning';
exports.SINGLEPOSE_THUNDER = 'SinglePose.Thunder';
exports.MULTIPOSE_LIGHTNING = 'MultiPose.Lightning';
exports.VALID_MODELS = [exports.SINGLEPOSE_LIGHTNING, exports.SINGLEPOSE_THUNDER, exports.MULTIPOSE_LIGHTNING];
exports.MOVENET_SINGLEPOSE_LIGHTNING_URL = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4';
exports.MOVENET_SINGLEPOSE_THUNDER_URL = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4';
exports.MOVENET_MULTIPOSE_LIGHTNING_URL = 'https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1';
exports.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = 192;
exports.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = 256;
exports.MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = 256;
// The default configuration for loading MoveNet.
exports.MOVENET_CONFIG = {
    modelType: exports.SINGLEPOSE_LIGHTNING,
    enableSmoothing: true
};
exports.MOVENET_ESTIMATION_CONFIG = {};
exports.KEYPOINT_FILTER_CONFIG = {
    frequency: 30,
    minCutOff: 2.5,
    beta: 300.0,
    derivateCutOff: 2.5,
    thresholdCutOff: 0.5,
    thresholdBeta: 5.0,
    disableValueScaling: true,
};
exports.CROP_FILTER_ALPHA = 0.9;
exports.MIN_CROP_KEYPOINT_SCORE = 0.2;
exports.DEFAULT_MIN_POSE_SCORE = 0.25;
exports.NUM_KEYPOINTS = 17;
exports.NUM_KEYPOINT_VALUES = 3; // [y, x, score]
exports.MULTIPOSE_BOX_SIZE = 5; // [ymin, xmin, ymax, xmax, score]
exports.MULTIPOSE_BOX_IDX = exports.NUM_KEYPOINTS * exports.NUM_KEYPOINT_VALUES;
exports.MULTIPOSE_BOX_SCORE_IDX = exports.MULTIPOSE_BOX_IDX + 4;
exports.MULTIPOSE_INSTANCE_SIZE = exports.NUM_KEYPOINTS * exports.NUM_KEYPOINT_VALUES + exports.MULTIPOSE_BOX_SIZE;
exports.DEFAULT_KEYPOINT_TRACKER_CONFIG = {
    maxTracks: 18,
    maxAge: 1000,
    minSimilarity: 0.2,
    keypointTrackerParams: {
        keypointConfidenceThreshold: 0.3,
        // From COCO:
        // https://cocodataset.org/#keypoints-eval
        keypointFalloff: [
            0.026, 0.025, 0.025, 0.035, 0.035, 0.079, 0.079, 0.072, 0.072, 0.062,
            0.062, 0.107, 0.107, 0.087, 0.087, 0.089, 0.089
        ],
        minNumberOfKeypoints: 4
    }
};
exports.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG = {
    maxTracks: 18,
    maxAge: 1000,
    minSimilarity: 0.15,
    trackerParams: {}
};
//# sourceMappingURL=constants.js.map