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
import { PoseNetEstimationConfig, PosenetModelConfig, PoseNetOutputStride, StringTuple } from './types';
export declare const MOBILENET_V1_CONFIG: PosenetModelConfig;
export declare const VALID_ARCHITECTURE: string[];
export declare const VALID_STRIDE: {
    MobileNetV1: number[];
    ResNet50: number[];
};
export declare const VALID_OUTPUT_STRIDES: PoseNetOutputStride[];
export declare const VALID_MULTIPLIER: {
    MobileNetV1: number[];
    ResNet50: number[];
};
export declare const VALID_QUANT_BYTES: number[];
export declare const SINGLE_PERSON_ESTIMATION_CONFIG: PoseNetEstimationConfig;
export declare const MULTI_PERSON_ESTIMATION_CONFIG: PoseNetEstimationConfig;
export declare const RESNET_MEAN: number[];
export declare const K_LOCAL_MAXIMUM_RADIUS = 1;
export declare const NUM_KEYPOINTS = 17;
export declare const POSE_CHAIN: StringTuple[];
