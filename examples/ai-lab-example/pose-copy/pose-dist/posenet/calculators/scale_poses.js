"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalePoses = void 0;
function scalePoses(poses, imageSize, inputResolution, padding) {
    var height = imageSize.height, width = imageSize.width;
    var scaleY = height / (inputResolution.height * (1 - padding.top - padding.bottom));
    var scaleX = width / (inputResolution.width * (1 - padding.left - padding.right));
    var offsetY = -padding.top * inputResolution.height;
    var offsetX = -padding.left * inputResolution.width;
    if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
        return poses;
    }
    for (var _i = 0, poses_1 = poses; _i < poses_1.length; _i++) {
        var pose = poses_1[_i];
        for (var _a = 0, _b = pose.keypoints; _a < _b.length; _a++) {
            var kp = _b[_a];
            kp.x = (kp.x + offsetX) * scaleX;
            kp.y = (kp.y + offsetY) * scaleY;
        }
    }
    return poses;
}
exports.scalePoses = scalePoses;
//# sourceMappingURL=scale_poses.js.map