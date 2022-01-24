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
exports.BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG = exports.BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG = exports.BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY = exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = exports.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG = exports.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = exports.BLAZEPOSE_NUM_KEYPOINTS = exports.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG = exports.BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG = exports.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG = exports.BLAZEPOSE_POSE_PRESENCE_SCORE = exports.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG = exports.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG = exports.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG = exports.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION = exports.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION = exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG = exports.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION = exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = exports.DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL = void 0;
exports.DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL = 'https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1';
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-full/model.json';
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-lite/model.json';
exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-heavy/model.json';
exports.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION = {
    reduceBoxesInLowestlayer: false,
    interpolatedScaleAspectRatio: 1.0,
    featureMapHeight: [],
    featureMapWidth: [],
    numLayers: 5,
    minScale: 0.1484375,
    maxScale: 0.75,
    inputSizeHeight: 224,
    inputSizeWidth: 224,
    anchorOffsetX: 0.5,
    anchorOffsetY: 0.5,
    strides: [8, 16, 32, 32, 32],
    aspectRatios: [1.0],
    fixedAnchorSize: true
};
exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG = {
    runtime: 'tfjs',
    modelType: 'full',
    enableSmoothing: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    detectorModelUrl: exports.DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
    landmarkModelUrl: exports.DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL
};
exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = {
    maxPoses: 1,
    flipHorizontal: false
};
exports.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION = {
    applyExponentialOnBoxSize: false,
    flipVertically: false,
    ignoreClasses: [],
    numClasses: 1,
    numBoxes: 2254,
    numCoords: 12,
    boxCoordOffset: 0,
    keypointCoordOffset: 4,
    numKeypoints: 4,
    numValuesPerKeypoint: 2,
    sigmoidScore: true,
    scoreClippingThresh: 100.0,
    reverseOutputOrder: true,
    xScale: 224.0,
    yScale: 224.0,
    hScale: 224.0,
    wScale: 224.0,
    minScoreThresh: 0.5
};
exports.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION = {
    minSuppressionThreshold: 0.3,
    overlapType: 'intersection-over-union'
};
exports.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG = {
    shiftX: 0,
    shiftY: 0,
    scaleX: 1.25,
    scaleY: 1.25,
    squareLong: true
};
exports.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG = {
    outputTensorSize: { width: 224, height: 224 },
    keepAspectRatio: true,
    outputTensorFloatRange: [-1, 1],
    borderMode: 'zero'
};
exports.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG = {
    outputTensorSize: { width: 256, height: 256 },
    keepAspectRatio: true,
    outputTensorFloatRange: [0, 1],
    borderMode: 'zero'
};
exports.BLAZEPOSE_POSE_PRESENCE_SCORE = 0.5;
exports.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG = {
    numLandmarks: 39,
    inputImageWidth: 256,
    inputImageHeight: 256,
    visibilityActivation: 'sigmoid',
    flipHorizontally: false,
    flipVertically: false
};
exports.BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG = {
    numLandmarks: 39,
    inputImageWidth: 1,
    inputImageHeight: 1,
    visibilityActivation: 'sigmoid',
    flipHorizontally: false,
    flipVertically: false
};
exports.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG = {
    kernelSize: 7,
    minConfidenceToRefine: 0.5
};
exports.BLAZEPOSE_NUM_KEYPOINTS = 33;
exports.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = 35;
exports.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG = {
    alpha: 0.1
};
exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = {
    oneEuroFilter: {
        frequency: 30,
        minCutOff: 0.05,
        // filter when landmark is static.
        beta: 80,
        // alpha in landmark EMA filter when landmark is moving fast.
        derivateCutOff: 1.0,
        // landmark velocity EMA filter.,
        minAllowedObjectScale: 1e-6
    }
};
// Auxiliary landmarks are smoothed heavier than main landmarks to make ROI
// crop for pose landmarks prediction very stable when object is not moving but
// responsive enough in case of sudden movements.
exports.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY = {
    oneEuroFilter: {
        frequency: 30,
        minCutOff: 0.01,
        // EMA filter when landmark is static.
        beta: 10.0,
        // ~0.68 alpha in landmark EMA filter when landmark is moving
        // fast.
        derivateCutOff: 1.0,
        // landmark velocity EMA filter.
        minAllowedObjectScale: 1e-6
    }
};
exports.BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = {
    oneEuroFilter: {
        frequency: 30,
        minCutOff: 0.1,
        // filter when landmark is static.
        beta: 40,
        // alpha in landmark EMA filter when landmark is moving fast.
        derivateCutOff: 1.0,
        // landmark velocity EMA filter.
        minAllowedObjectScale: 1e-6,
        disableValueScaling: true // As world landmarks are predicted in real world 3D coordintates
        // in meters (rather than in pixels of input image) prediction
        // scale does not depend on the pose size in the image.
    }
};
exports.BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG = {
    activation: 'none',
};
exports.BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG = {
    combineWithPreviousRatio: 0.7
};
//# sourceMappingURL=constants.js.map