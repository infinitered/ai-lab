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
exports.initCropRegion = exports.determineNextCropRegion = exports.torsoVisible = void 0;
var constants_1 = require("../constants");
var constants_2 = require("./constants");
/**
 * Determines whether the torso of a person is visible.
 *
 * @param keypoints An array of `Keypoint`s associated with a person.
 * @param keypointIndexByName A map from keypoint name to index in the keypoints
 *     array.
 * @return A boolean indicating whether the torso is visible.
 */
function torsoVisible(keypoints, keypointIndexByName) {
    return ((keypoints[keypointIndexByName['left_hip']].score >
        constants_2.MIN_CROP_KEYPOINT_SCORE ||
        keypoints[keypointIndexByName['right_hip']].score >
            constants_2.MIN_CROP_KEYPOINT_SCORE) &&
        (keypoints[keypointIndexByName['left_shoulder']].score >
            constants_2.MIN_CROP_KEYPOINT_SCORE ||
            keypoints[keypointIndexByName['right_shoulder']].score >
                constants_2.MIN_CROP_KEYPOINT_SCORE));
}
exports.torsoVisible = torsoVisible;
/**
 * Calculates the maximum distance from each keypoint to the center location.
 * The function returns the maximum distances from the two sets of keypoints:
 * full 17 keypoints and 4 torso keypoints. The returned information will be
 * used to determine the crop size. See determineCropRegion for more detail.
 *
 * @param keypoints An array of `Keypoint`s associated with a person.
 * @param keypointIndexByName A map from keypoint name to index in the keypoints
 *     array.
 * @param targetKeypoints Maps from joint names to coordinates.
 * @param centerY The Y coordinate of the center of the person.
 * @param centerX The X coordinate of the center of the person.
 * @return An array containing information about the torso and body range in the
 *     image: [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange].
 */
function determineTorsoAndBodyRange(keypoints, keypointIndexByName, targetKeypoints, centerY, centerX) {
    var torsoJoints = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'];
    var maxTorsoYrange = 0.0;
    var maxTorsoXrange = 0.0;
    for (var i = 0; i < torsoJoints.length; i++) {
        var distY = Math.abs(centerY - targetKeypoints[torsoJoints[i]][0]);
        var distX = Math.abs(centerX - targetKeypoints[torsoJoints[i]][1]);
        if (distY > maxTorsoYrange) {
            maxTorsoYrange = distY;
        }
        if (distX > maxTorsoXrange) {
            maxTorsoXrange = distX;
        }
    }
    var maxBodyYrange = 0.0;
    var maxBodyXrange = 0.0;
    for (var _i = 0, _a = Object.keys(targetKeypoints); _i < _a.length; _i++) {
        var key = _a[_i];
        if (keypoints[keypointIndexByName[key]].score < constants_2.MIN_CROP_KEYPOINT_SCORE) {
            continue;
        }
        var distY = Math.abs(centerY - targetKeypoints[key][0]);
        var distX = Math.abs(centerX - targetKeypoints[key][1]);
        if (distY > maxBodyYrange) {
            maxBodyYrange = distY;
        }
        if (distX > maxBodyXrange) {
            maxBodyXrange = distX;
        }
    }
    return [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange];
}
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
function determineNextCropRegion(currentCropRegion, keypoints, keypointIndexByName, imageSize) {
    var targetKeypoints = {};
    for (var _i = 0, COCO_KEYPOINTS_1 = constants_1.COCO_KEYPOINTS; _i < COCO_KEYPOINTS_1.length; _i++) {
        var key = COCO_KEYPOINTS_1[_i];
        targetKeypoints[key] = [
            keypoints[keypointIndexByName[key]].y * imageSize.height,
            keypoints[keypointIndexByName[key]].x * imageSize.width
        ];
    }
    if (torsoVisible(keypoints, keypointIndexByName)) {
        var centerY = (targetKeypoints['left_hip'][0] + targetKeypoints['right_hip'][0]) / 2;
        var centerX = (targetKeypoints['left_hip'][1] + targetKeypoints['right_hip'][1]) / 2;
        var _a = determineTorsoAndBodyRange(keypoints, keypointIndexByName, targetKeypoints, centerY, centerX), maxTorsoYrange = _a[0], maxTorsoXrange = _a[1], maxBodyYrange = _a[2], maxBodyXrange = _a[3];
        var cropLengthHalf = Math.max(maxTorsoXrange * 1.9, maxTorsoYrange * 1.9, maxBodyYrange * 1.2, maxBodyXrange * 1.2);
        cropLengthHalf = Math.min(cropLengthHalf, Math.max(centerX, imageSize.width - centerX, centerY, imageSize.height - centerY));
        var cropCorner = [centerY - cropLengthHalf, centerX - cropLengthHalf];
        if (cropLengthHalf > Math.max(imageSize.width, imageSize.height) / 2) {
            return initCropRegion(currentCropRegion == null, imageSize);
        }
        else {
            var cropLength = cropLengthHalf * 2;
            return {
                yMin: cropCorner[0] / imageSize.height,
                xMin: cropCorner[1] / imageSize.width,
                yMax: (cropCorner[0] + cropLength) / imageSize.height,
                xMax: (cropCorner[1] + cropLength) / imageSize.width,
                height: (cropCorner[0] + cropLength) / imageSize.height -
                    cropCorner[0] / imageSize.height,
                width: (cropCorner[1] + cropLength) / imageSize.width -
                    cropCorner[1] / imageSize.width
            };
        }
    }
    else {
        return initCropRegion(currentCropRegion == null, imageSize);
    }
}
exports.determineNextCropRegion = determineNextCropRegion;
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
function initCropRegion(firstFrame, imageSize) {
    var boxHeight, boxWidth, yMin, xMin;
    if (firstFrame) {
        // If it is the first frame, perform a best guess by making the square
        // crop at the image center to better utilize the image pixels and
        // create higher chance to enter the cropping loop.
        if (imageSize.width > imageSize.height) {
            boxHeight = 1.0;
            boxWidth = imageSize.height / imageSize.width;
            yMin = 0.0;
            xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
        }
        else {
            boxHeight = imageSize.width / imageSize.height;
            boxWidth = 1.0;
            yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
            xMin = 0.0;
        }
    }
    else {
        // No cropRegion was available from a previous estimatePoses() call, so
        // run the model on the full image with padding on both sides.
        if (imageSize.width > imageSize.height) {
            boxHeight = imageSize.width / imageSize.height;
            boxWidth = 1.0;
            yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
            xMin = 0.0;
        }
        else {
            boxHeight = 1.0;
            boxWidth = imageSize.height / imageSize.width;
            yMin = 0.0;
            xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
        }
    }
    return {
        yMin: yMin,
        xMin: xMin,
        yMax: yMin + boxHeight,
        xMax: xMin + boxWidth,
        height: boxHeight,
        width: boxWidth
    };
}
exports.initCropRegion = initCropRegion;
//# sourceMappingURL=crop_utils.js.map