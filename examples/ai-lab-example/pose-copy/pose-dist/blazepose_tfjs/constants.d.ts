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
import { ImageToTensorConfig, TensorsToLandmarksConfig } from '../shared/calculators/interfaces/config_interfaces';
import { BlazePoseTfjsModelConfig } from './types';
export declare const DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL = "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1";
export declare const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = "https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-full/model.json";
export declare const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = "https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-lite/model.json";
export declare const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = "https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-heavy/model.json";
export declare const BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION: {
    reduceBoxesInLowestlayer: boolean;
    interpolatedScaleAspectRatio: number;
    featureMapHeight: number[];
    featureMapWidth: number[];
    numLayers: number;
    minScale: number;
    maxScale: number;
    inputSizeHeight: number;
    inputSizeWidth: number;
    anchorOffsetX: number;
    anchorOffsetY: number;
    strides: number[];
    aspectRatios: number[];
    fixedAnchorSize: boolean;
};
export declare const DEFAULT_BLAZEPOSE_MODEL_CONFIG: BlazePoseTfjsModelConfig;
export declare const DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG: {
    maxPoses: number;
    flipHorizontal: boolean;
};
export declare const BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION: {
    applyExponentialOnBoxSize: boolean;
    flipVertically: boolean;
    ignoreClasses: number[];
    numClasses: number;
    numBoxes: number;
    numCoords: number;
    boxCoordOffset: number;
    keypointCoordOffset: number;
    numKeypoints: number;
    numValuesPerKeypoint: number;
    sigmoidScore: boolean;
    scoreClippingThresh: number;
    reverseOutputOrder: boolean;
    xScale: number;
    yScale: number;
    hScale: number;
    wScale: number;
    minScoreThresh: number;
};
export declare const BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION: {
    minSuppressionThreshold: number;
    overlapType: "intersection-over-union";
};
export declare const BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG: {
    shiftX: number;
    shiftY: number;
    scaleX: number;
    scaleY: number;
    squareLong: boolean;
};
export declare const BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG: ImageToTensorConfig;
export declare const BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG: ImageToTensorConfig;
export declare const BLAZEPOSE_POSE_PRESENCE_SCORE = 0.5;
export declare const BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG: TensorsToLandmarksConfig;
export declare const BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG: TensorsToLandmarksConfig;
export declare const BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG: {
    kernelSize: number;
    minConfidenceToRefine: number;
};
export declare const BLAZEPOSE_NUM_KEYPOINTS = 33;
export declare const BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = 35;
export declare const BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG: {
    alpha: number;
};
export declare const BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL: {
    oneEuroFilter: {
        frequency: number;
        minCutOff: number;
        beta: number;
        derivateCutOff: number;
        minAllowedObjectScale: number;
    };
};
export declare const BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY: {
    oneEuroFilter: {
        frequency: number;
        minCutOff: number;
        beta: number;
        derivateCutOff: number;
        minAllowedObjectScale: number;
    };
};
export declare const BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL: {
    oneEuroFilter: {
        frequency: number;
        minCutOff: number;
        beta: number;
        derivateCutOff: number;
        minAllowedObjectScale: number;
        disableValueScaling: boolean;
    };
};
export declare const BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG: {
    activation: "none";
};
export declare const BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG: {
    combineWithPreviousRatio: number;
};
