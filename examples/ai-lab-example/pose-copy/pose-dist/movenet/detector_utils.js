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
exports.mergeBoundingBoxTrackerConfig = exports.mergeKeypointTrackerConfig = exports.validateEstimationConfig = exports.validateModelConfig = void 0;
var types_1 = require("../calculators/types");
var constants_1 = require("./constants");
function validateModelConfig(modelConfig) {
    var config = modelConfig == null ? constants_1.MOVENET_CONFIG : __assign({}, modelConfig);
    if (config.modelType == null) {
        config.modelType = 'SinglePose.Lightning';
    }
    else if (constants_1.VALID_MODELS.indexOf(config.modelType) < 0) {
        throw new Error("Invalid architecture " + config.modelType + ". " +
            ("Should be one of " + constants_1.VALID_MODELS));
    }
    if (config.enableSmoothing == null) {
        config.enableSmoothing = true;
    }
    if (config.minPoseScore != null &&
        (config.minPoseScore < 0.0 || config.minPoseScore > 1.0)) {
        throw new Error("minPoseScore should be between 0.0 and 1.0");
    }
    if (config.multiPoseMaxDimension != null &&
        (config.multiPoseMaxDimension % 32 !== 0 ||
            config.multiPoseMaxDimension < 32)) {
        throw new Error("multiPoseMaxDimension must be a multiple of 32 and higher than 0");
    }
    if (config.modelType === constants_1.MULTIPOSE_LIGHTNING &&
        config.enableTracking == null) {
        config.enableTracking = true;
    }
    if (config.modelType === constants_1.MULTIPOSE_LIGHTNING &&
        config.enableTracking === true) {
        if (config.trackerType == null) {
            config.trackerType = types_1.TrackerType.BoundingBox;
        }
        if (config.trackerType === types_1.TrackerType.Keypoint) {
            if (config.trackerConfig != null) {
                config.trackerConfig = mergeKeypointTrackerConfig(config.trackerConfig);
            }
            else {
                config.trackerConfig = constants_1.DEFAULT_KEYPOINT_TRACKER_CONFIG;
            }
        }
        else if (config.trackerType === types_1.TrackerType.BoundingBox) {
            if (config.trackerConfig != null) {
                config.trackerConfig =
                    mergeBoundingBoxTrackerConfig(config.trackerConfig);
            }
            else {
                config.trackerConfig = constants_1.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG;
            }
        }
        else {
            throw new Error('Tracker type not supported by MoveNet');
        }
        // We don't need to validate the trackerConfig here because the tracker will
        // take care of that.
    }
    return config;
}
exports.validateModelConfig = validateModelConfig;
function validateEstimationConfig(estimationConfig) {
    var config = estimationConfig == null ? constants_1.MOVENET_ESTIMATION_CONFIG : __assign({}, estimationConfig);
    return config;
}
exports.validateEstimationConfig = validateEstimationConfig;
function mergeBaseTrackerConfig(defaultConfig, userConfig) {
    var mergedConfig = {
        maxTracks: defaultConfig.maxTracks,
        maxAge: defaultConfig.maxAge,
        minSimilarity: defaultConfig.minSimilarity,
    };
    if (userConfig.maxTracks != null) {
        mergedConfig.maxTracks = userConfig.maxTracks;
    }
    if (userConfig.maxAge != null) {
        mergedConfig.maxAge = userConfig.maxAge;
    }
    if (userConfig.minSimilarity != null) {
        mergedConfig.minSimilarity = userConfig.minSimilarity;
    }
    return mergedConfig;
}
function mergeKeypointTrackerConfig(userConfig) {
    var mergedConfig = mergeBaseTrackerConfig(constants_1.DEFAULT_KEYPOINT_TRACKER_CONFIG, userConfig);
    mergedConfig.keypointTrackerParams = __assign({}, constants_1.DEFAULT_KEYPOINT_TRACKER_CONFIG.keypointTrackerParams);
    if (userConfig.keypointTrackerParams != null) {
        if (userConfig.keypointTrackerParams.keypointConfidenceThreshold != null) {
            mergedConfig.keypointTrackerParams.keypointConfidenceThreshold =
                userConfig.keypointTrackerParams.keypointConfidenceThreshold;
        }
        if (userConfig.keypointTrackerParams.keypointFalloff != null) {
            mergedConfig.keypointTrackerParams.keypointFalloff =
                userConfig.keypointTrackerParams.keypointFalloff;
        }
        if (userConfig.keypointTrackerParams.minNumberOfKeypoints != null) {
            mergedConfig.keypointTrackerParams.minNumberOfKeypoints =
                userConfig.keypointTrackerParams.minNumberOfKeypoints;
        }
    }
    return mergedConfig;
}
exports.mergeKeypointTrackerConfig = mergeKeypointTrackerConfig;
function mergeBoundingBoxTrackerConfig(userConfig) {
    var mergedConfig = mergeBaseTrackerConfig(constants_1.DEFAULT_BOUNDING_BOX_TRACKER_CONFIG, userConfig);
    return mergedConfig;
}
exports.mergeBoundingBoxTrackerConfig = mergeBoundingBoxTrackerConfig;
//# sourceMappingURL=detector_utils.js.map