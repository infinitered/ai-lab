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
import { InputResolution } from '../types';
import { PoseNetOutputStride } from './types';
export declare function resNet50Checkpoint(stride: number, quantBytes: number): string;
export declare function mobileNetCheckpoint(stride: number, multiplier: number, quantBytes: number): string;
export declare function getValidInputResolutionDimensions(inputResolution: InputResolution, outputStride: PoseNetOutputStride): InputResolution;
export declare function toValidInputResolution(inputResolution: number, outputStride: PoseNetOutputStride): number;
