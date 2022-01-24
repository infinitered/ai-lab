/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs-core';
import { Keypoint } from '../../shared/calculators/interfaces/common_interfaces';
import { Pose } from '../../types';
import { Part, PartWithScore, Vector2D } from '../types';
export declare function toTensorBuffers3D(tensors: tf.Tensor3D[]): Promise<Array<tf.TensorBuffer<tf.Rank.R3>>>;
export declare function getOffsetPoint(y: number, x: number, keypoint: number, offsets: tf.TensorBuffer<tf.Rank.R3>): Vector2D;
export declare function getImageCoords(part: Part, outputStride: number, offsets: tf.TensorBuffer<tf.Rank.R3>): Vector2D;
export declare function squaredDistance(y1: number, x1: number, y2: number, x2: number): number;
export declare function withinNmsRadiusOfCorrespondingPoint(poses: Pose[], squaredNmsRadius: number, { x, y }: {
    x: number;
    y: number;
}, keypointId: number): boolean;
export declare function addVectors(a: Vector2D, b: Vector2D): Vector2D;
/**
 * Follows the displacement fields to decode the full pose of the object
 * instance given the position of a part that acts as root.
 *
 * @return An array of decoded keypoints and their scores for a single pose
 */
export declare function decodePose(root: PartWithScore, scores: tf.TensorBuffer<tf.Rank.R3>, offsets: tf.TensorBuffer<tf.Rank.R3>, outputStride: number, displacementsFwd: tf.TensorBuffer<tf.Rank.R3>, displacementsBwd: tf.TensorBuffer<tf.Rank.R3>): Keypoint[];
export declare function getInstanceScore(existingPoses: Pose[], squaredNmsRadius: number, instanceKeypoints: Keypoint[]): number;
