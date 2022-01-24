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
exports.POSE_CHAIN = exports.NUM_KEYPOINTS = exports.K_LOCAL_MAXIMUM_RADIUS = exports.RESNET_MEAN = exports.MULTI_PERSON_ESTIMATION_CONFIG = exports.SINGLE_PERSON_ESTIMATION_CONFIG = exports.VALID_QUANT_BYTES = exports.VALID_MULTIPLIER = exports.VALID_OUTPUT_STRIDES = exports.VALID_STRIDE = exports.VALID_ARCHITECTURE = exports.MOBILENET_V1_CONFIG = void 0;
// The default configuration for loading MobileNetV1 based PoseNet.
//
// (And for references, the default configuration for loading ResNet
// based PoseNet is also included).
//
// ```
// const RESNET_CONFIG = {
//   architecture: 'ResNet50',
//   outputStride: 32,
//   quantBytes: 2,
// } as ModelConfig;
// ```
exports.MOBILENET_V1_CONFIG = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    inputResolution: { height: 257, width: 257 }
};
exports.VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
exports.VALID_STRIDE = {
    'MobileNetV1': [8, 16],
    'ResNet50': [16]
};
exports.VALID_OUTPUT_STRIDES = [8, 16, 32];
exports.VALID_MULTIPLIER = {
    'MobileNetV1': [0.50, 0.75, 1.0],
    'ResNet50': [1.0]
};
exports.VALID_QUANT_BYTES = [1, 2, 4];
exports.SINGLE_PERSON_ESTIMATION_CONFIG = {
    maxPoses: 1,
    flipHorizontal: false
};
exports.MULTI_PERSON_ESTIMATION_CONFIG = {
    maxPoses: 5,
    flipHorizontal: false,
    scoreThreshold: 0.5,
    nmsRadius: 20
};
exports.RESNET_MEAN = [-123.15, -115.90, -103.06];
// A point (y, x) is considered as root part candidate if its score is a
// maximum in a window |y - y'| <= kLocalMaximumRadius, |x - x'| <=
// kLocalMaximumRadius.
exports.K_LOCAL_MAXIMUM_RADIUS = 1;
exports.NUM_KEYPOINTS = 17;
/*
 * Define the skeleton. This defines the parent->child relationships of our
 * tree. Arbitrarily this defines the nose as the root of the tree, however
 * since we will infer the displacement for both parent->child and
 * child->parent, we can define the tree root as any node.
 */
exports.POSE_CHAIN = [
    ['nose', 'left_eye'], ['left_eye', 'left_ear'], ['nose', 'right_eye'],
    ['right_eye', 'right_ear'], ['nose', 'left_shoulder'],
    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
    ['left_shoulder', 'left_hip'], ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'], ['nose', 'right_shoulder'],
    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
    ['right_shoulder', 'right_hip'], ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle']
];
//# sourceMappingURL=constants.js.map