"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowPassFilter = void 0;
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
/**
 * A stateful filter that smoothes values overtime.
 *
 * More specifically, it stores the previous value, and when there's a new
 * value, a coefficient 'alpha' is applied to the new value, and `1 - alpha` is
 * applied to the previous value. The smaller the alpha is, the smoother result
 * and the bigger lag.
 */
// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/util/filtering/low_pass_filter.cc
var LowPassFilter = /** @class */ (function () {
    function LowPassFilter(alpha) {
        this.alpha = alpha;
        this.initialized = false;
    }
    LowPassFilter.prototype.apply = function (value, threshold) {
        var result;
        if (this.initialized) {
            if (threshold == null) {
                // Regular lowpass filter.
                // result = this.alpha * value + (1 - this.alpha) * this.storedValue;
                result = this.storedValue + this.alpha * (value - this.storedValue);
            }
            else {
                // We need to reformat the formula to be able to conveniently apply
                // another optional non-linear function to the
                // (value - this.storedValue) part.
                // Add additional non-linearity to cap extreme value.
                // More specifically, assume x = (value - this.storedValue), when x is
                // close zero, the derived x is close to x, when x is several magnitudes
                // larger, the drived x grows much slower then x. It behaves like
                // sign(x)log(abs(x)).
                result = this.storedValue +
                    this.alpha * threshold *
                        Math.asinh((value - this.storedValue) / threshold);
            }
        }
        else {
            result = value;
            this.initialized = true;
        }
        this.rawValue = value;
        this.storedValue = result;
        return result;
    };
    LowPassFilter.prototype.applyWithAlpha = function (value, alpha, threshold) {
        this.alpha = alpha;
        return this.apply(value, threshold);
    };
    LowPassFilter.prototype.hasLastRawValue = function () {
        return this.initialized;
    };
    LowPassFilter.prototype.lastRawValue = function () {
        return this.rawValue;
    };
    LowPassFilter.prototype.reset = function () {
        this.initialized = false;
    };
    return LowPassFilter;
}());
exports.LowPassFilter = LowPassFilter;
//# sourceMappingURL=low_pass_filter.js.map