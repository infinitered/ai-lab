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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEstimationConfig = exports.validateModelConfig = void 0;
var constants_1 = require("./constants");
function validateModelConfig(modelConfig) {
    if (modelConfig == null) {
        return __assign({}, constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG);
    }
    var config = __assign({}, modelConfig);
    config.runtime = 'mediapipe';
    if (config.enableSegmentation == null) {
        config.enableSegmentation =
            constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSegmentation;
    }
    if (config.enableSmoothing == null) {
        config.enableSmoothing = constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing;
    }
    if (config.smoothSegmentation == null) {
        config.smoothSegmentation =
            constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.smoothSegmentation;
    }
    if (config.modelType == null) {
        config.modelType = constants_1.DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType;
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function validateEstimationConfig(estimationConfig) {
    if (estimationConfig == null) {
        return __assign({}, constants_1.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG);
    }
    var config = __assign({}, estimationConfig);
    if (config.maxPoses == null) {
        config.maxPoses = 1;
    }
    if (config.maxPoses <= 0) {
        throw new Error("Invalid maxPoses " + config.maxPoses + ". Should be > 0.");
    }
    if (config.maxPoses > 1) {
        throw new Error('Multi-pose detection is not implemented yet. Please set maxPoses ' +
            'to 1.');
    }
    if (config.flipHorizontal == null) {
        config.flipHorizontal = constants_1.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG.flipHorizontal;
    }
    return config;
}
exports.validateEstimationConfig = validateEstimationConfig;
//# sourceMappingURL=detector_utils.js.map