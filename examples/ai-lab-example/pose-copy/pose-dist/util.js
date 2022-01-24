"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeypointIndexByName = exports.getAdjacentPairs = exports.getKeypointIndexBySide = void 0;
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
var constants = require("./constants");
var types_1 = require("./types");
function getKeypointIndexBySide(model) {
    switch (model) {
        case types_1.SupportedModels.BlazePose:
            return constants.BLAZEPOSE_KEYPOINTS_BY_SIDE;
        case types_1.SupportedModels.PoseNet:
        case types_1.SupportedModels.MoveNet:
            return constants.COCO_KEYPOINTS_BY_SIDE;
        default:
            throw new Error("Model " + model + " is not supported.");
    }
}
exports.getKeypointIndexBySide = getKeypointIndexBySide;
function getAdjacentPairs(model) {
    switch (model) {
        case types_1.SupportedModels.BlazePose:
            return constants.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS;
        case types_1.SupportedModels.PoseNet:
        case types_1.SupportedModels.MoveNet:
            return constants.COCO_CONNECTED_KEYPOINTS_PAIRS;
        default:
            throw new Error("Model " + model + " is not supported.");
    }
}
exports.getAdjacentPairs = getAdjacentPairs;
function getKeypointIndexByName(model) {
    switch (model) {
        case types_1.SupportedModels.BlazePose:
            return constants.BLAZEPOSE_KEYPOINTS.reduce(function (map, name, i) {
                map[name] = i;
                return map;
            }, {});
        case types_1.SupportedModels.PoseNet:
        case types_1.SupportedModels.MoveNet:
            return constants.COCO_KEYPOINTS.reduce(function (map, name, i) {
                map[name] = i;
                return map;
            }, {});
        default:
            throw new Error("Model " + model + " is not supported.");
    }
}
exports.getKeypointIndexByName = getKeypointIndexByName;
//# sourceMappingURL=util.js.map