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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypointsOneEuroFilter = void 0;
var one_euro_filter_1 = require("./one_euro_filter");
/**
 * A stateful filter that smoothes keypoints values overtime.
 *
 * More specifically, it uses `OneEuroFilter` to smooth every x, y, z
 * coordinates over time, which as result gives us velocity of how these values
 * change over time. With higher velocity it weights new values higher.
 */
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmarks_smoothing_calculator.cc
var KeypointsOneEuroFilter = /** @class */ (function () {
    function KeypointsOneEuroFilter(config) {
        this.config = config;
    }
    KeypointsOneEuroFilter.prototype.apply = function (keypoints, microSeconds, objectScale) {
        var _this = this;
        if (keypoints == null) {
            this.reset();
            return null;
        }
        // Initialize filters once.
        this.initializeFiltersIfEmpty(keypoints);
        // Get value scale as inverse value of the object scale.
        // If value is too small smoothing will be disabled and keypoints will be
        // returned as is.
        var valueScale = 1;
        if (!this.config.disableValueScaling) {
            if (objectScale < this.config.minAllowedObjectScale) {
                return __spreadArrays(keypoints);
            }
            valueScale = 1.0 / objectScale;
        }
        // Filter keypoints. Every axis of every keypoint is filtered separately.
        return keypoints.map(function (keypoint, i) {
            var outKeypoint = __assign(__assign({}, keypoint), { x: _this.xFilters[i].apply(keypoint.x, microSeconds, valueScale), y: _this.yFilters[i].apply(keypoint.y, microSeconds, valueScale) });
            if (keypoint.z != null) {
                outKeypoint.z =
                    _this.zFilters[i].apply(keypoint.z, microSeconds, valueScale);
            }
            return outKeypoint;
        });
    };
    KeypointsOneEuroFilter.prototype.reset = function () {
        this.xFilters = null;
        this.yFilters = null;
        this.zFilters = null;
    };
    // Initializes filters for the first time or after reset. If initialized the
    // check the size.
    KeypointsOneEuroFilter.prototype.initializeFiltersIfEmpty = function (keypoints) {
        var _this = this;
        if (this.xFilters == null || this.xFilters.length !== keypoints.length) {
            this.xFilters = keypoints.map(function (_) { return new one_euro_filter_1.OneEuroFilter(_this.config); });
            this.yFilters = keypoints.map(function (_) { return new one_euro_filter_1.OneEuroFilter(_this.config); });
            this.zFilters = keypoints.map(function (_) { return new one_euro_filter_1.OneEuroFilter(_this.config); });
        }
    };
    return KeypointsOneEuroFilter;
}());
exports.KeypointsOneEuroFilter = KeypointsOneEuroFilter;
//# sourceMappingURL=keypoints_one_euro_filter.js.map