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
exports.removeDetectionLetterbox = void 0;
/**
 * Adjusts detection locations on the letterboxed image to the corresponding
 * locations on the same image with the letterbox removed (the input image to
 * the graph before image transformation).
 *
 * @param detections A list of detection boxes on an letterboxed image.
 * @param letterboxPadding A `padding` object representing the letterbox padding
 *     from the 4 sides: left, top, right, bottom, of the letterboxed image,
 *     normalized by the letterboxed image dimensions.
 * @returns detections: A list of detection boxes representing detections with
 *     their locations adjusted to the letterbox-removed (non-padded) image.
 */
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/detection_letterbox_removal_calculator.cc
function removeDetectionLetterbox(detections, letterboxPadding) {
    if (detections === void 0) { detections = []; }
    var left = letterboxPadding.left;
    var top = letterboxPadding.top;
    var leftAndRight = letterboxPadding.left + letterboxPadding.right;
    var topAndBottom = letterboxPadding.top + letterboxPadding.bottom;
    for (var i = 0; i < detections.length; i++) {
        var detection = detections[i];
        var relativeBoundingBox = detection.locationData.relativeBoundingBox;
        var xMin = (relativeBoundingBox.xMin - left) / (1 - leftAndRight);
        var yMin = (relativeBoundingBox.yMin - top) / (1 - topAndBottom);
        var width = relativeBoundingBox.width / (1 - leftAndRight);
        var height = relativeBoundingBox.height / (1 - topAndBottom);
        relativeBoundingBox.xMin = xMin;
        relativeBoundingBox.yMin = yMin;
        relativeBoundingBox.width = width;
        relativeBoundingBox.height = height;
        relativeBoundingBox.xMax = xMin + width;
        relativeBoundingBox.yMax = yMin + height;
        var relativeKeypoints = detection.locationData.relativeKeypoints;
        if (relativeKeypoints) {
            relativeKeypoints.forEach(function (keypoint) {
                var newX = (keypoint.x - left) / (1 - leftAndRight);
                var newY = (keypoint.y - top) / (1 - topAndBottom);
                keypoint.x = newX;
                keypoint.y = newY;
            });
        }
    }
    return detections;
}
exports.removeDetectionLetterbox = removeDetectionLetterbox;
//# sourceMappingURL=remove_detection_letterbox.js.map