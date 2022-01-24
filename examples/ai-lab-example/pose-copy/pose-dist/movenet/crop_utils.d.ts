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
import { ImageSize, Keypoint } from '../shared/calculators/interfaces/common_interfaces';
import { BoundingBox } from '../shared/calculators/interfaces/shape_interfaces';
/**
 * Determines whether the torso of a person is visible.
 *
 * @param keypoints An array of `Keypoint`s associated with a person.
 * @param keypointIndexByName A map from keypoint name to index in the keypoints
 *     array.
 * @return A boolean indicating whether the torso is visible.
 */
export declare function torsoVisible(keypoints: Keypoint[], keypointIndexByName: {
    [index: string]: number;
}): boolean;
/**
 * Determines the region to crop the image for the model to run inference on.
 * The algorithm uses the detected joints from the previous frame to estimate
 * the square region that encloses the full body of the target person and
 * centers at the midpoint of two hip joints. The crop size is determined by
 * the distances between each joint and the center point.
 * When the model is not confident with the four torso joint predictions, the
 * function returns a default crop which is the full image padded to square.
 *
 * @param currentCropRegion The crop region that was used for the current frame.
 *     Can be null for the very first frame that is handled by the detector.
 * @param keypoints An array of `Keypoint`s associated with a person.
 * @param keypointIndexByName A map from keypoint name to index in the keypoints
 *     array.
 * @param imageSize The size of the image that is being processed.
 * @return A `BoundingBox` that contains the new crop region.
 */
export declare function determineNextCropRegion(currentCropRegion: BoundingBox, keypoints: Keypoint[], keypointIndexByName: {
    [index: string]: number;
}, imageSize: ImageSize): BoundingBox;
/**
 * Provides initial crop region.
 *
 * The function provides the initial crop region when the algorithm cannot
 * reliably determine the crop region from the previous frame. There are two
 * scenarios:
 *   1) The very first frame: the function returns the best guess by cropping
 *      a square in the middle of the image.
 *   2) Not enough reliable keypoints detected from the previous frame: the
 *      function pads the full image from both sides to make it a square
 *      image.
 *
 * @param firstFrame A boolean indicating whether we are initializing a crop
 *     region for the very first frame.
 * @param imageSize The size of the image that is being processed.
 * @return A `BoundingBox` that contains the initial crop region.
 */
export declare function initCropRegion(firstFrame: boolean, imageSize: ImageSize): BoundingBox;
