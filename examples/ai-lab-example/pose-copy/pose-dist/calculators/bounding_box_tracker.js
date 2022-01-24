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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingBoxTracker = void 0;
var tracker_1 = require("./tracker");
/**
 * BoundingBoxTracker, which tracks objects based on bounding box similarity,
 * currently defined as intersection-over-union (IoU).
 */
var BoundingBoxTracker = /** @class */ (function (_super) {
    __extends(BoundingBoxTracker, _super);
    function BoundingBoxTracker(config) {
        return _super.call(this, config) || this;
    }
    /**
     * Computes similarity based on intersection-over-union (IoU). See `Tracker`
     * for more details.
     */
    BoundingBoxTracker.prototype.computeSimilarity = function (poses) {
        var _this = this;
        if (poses.length === 0 || this.tracks.length === 0) {
            return [[]];
        }
        var simMatrix = poses.map(function (pose) {
            return _this.tracks.map(function (track) {
                return _this.iou(pose, track);
            });
        });
        return simMatrix;
    };
    /**
     * Computes the intersection-over-union (IoU) between a pose and a track.
     * @param pose A `Pose`.
     * @param track A `Track`.
     * @returns The IoU  between the pose and the track. This number is
     * between 0 and 1, and larger values indicate more box similarity.
     */
    BoundingBoxTracker.prototype.iou = function (pose, track) {
        var xMin = Math.max(pose.box.xMin, track.box.xMin);
        var yMin = Math.max(pose.box.yMin, track.box.yMin);
        var xMax = Math.min(pose.box.xMax, track.box.xMax);
        var yMax = Math.min(pose.box.yMax, track.box.yMax);
        if (xMin >= xMax || yMin >= yMax) {
            return 0.0;
        }
        var intersection = (xMax - xMin) * (yMax - yMin);
        var areaPose = pose.box.width * pose.box.height;
        var areaTrack = track.box.width * track.box.height;
        return intersection / (areaPose + areaTrack - intersection);
    };
    return BoundingBoxTracker;
}(tracker_1.Tracker));
exports.BoundingBoxTracker = BoundingBoxTracker;
//# sourceMappingURL=bounding_box_tracker.js.map