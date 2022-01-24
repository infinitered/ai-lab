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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSinglePose = void 0;
var constants_1 = require("../../constants");
var decode_single_pose_util_1 = require("./decode_single_pose_util");
/**
 * Detects a single pose and finds its parts from part scores and offset
 * vectors. It returns a single pose detection. It works as follows:
 * argmax2d is done on the scores to get the y and x index in the heatmap
 * with the highest score for each part, which is essentially where the
 * part is most likely to exist. This produces a tensor of size 17x2, with
 * each row being the y and x index in the heatmap for each keypoint.
 * The offset vector for each part is retrieved by getting the
 * y and x from the offsets corresponding to the y and x index in the
 * heatmap for that part. This produces a tensor of size 17x2, with each
 * row being the offset vector for the corresponding keypoint.
 * To get the keypoint, each part’s heatmap y and x are multiplied
 * by the output stride then added to their corresponding offset vector,
 * which is in the same scale as the original image.
 *
 * @param heatmapScores 3-D tensor with shape `[height, width, numParts]`.
 * The value of heatmapScores[y, x, k]` is the score of placing the `k`-th
 * object part at position `(y, x)`.
 *
 * @param offsets 3-D tensor with shape `[height, width, numParts * 2]`.
 * The value of [offsets[y, x, k], offsets[y, x, k + numParts]]` is the
 * short range offset vector of the `k`-th  object part at heatmap
 * position `(y, x)`.
 *
 * @param outputStride The output stride that was used when feed-forwarding
 * through the PoseNet model.  Must be 32, 16, or 8.
 *
 * @return A promise that resolves with single pose with a confidence score,
 * which contains an array of keypoints indexed by part id, each with a score
 * and position.
 */
function decodeSinglePose(heatmapScores, offsets, outputStride) {
    return __awaiter(this, void 0, void 0, function () {
        var totalScore, heatmapValues, allTensorBuffers, scoresBuffer, offsetsBuffer, heatmapValuesBuffer, offsetPoints, offsetPointsBuffer, keypointConfidence, keypoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    totalScore = 0.0;
                    heatmapValues = decode_single_pose_util_1.argmax2d(heatmapScores);
                    return [4 /*yield*/, Promise.all([heatmapScores.buffer(), offsets.buffer(), heatmapValues.buffer()])];
                case 1:
                    allTensorBuffers = _a.sent();
                    scoresBuffer = allTensorBuffers[0];
                    offsetsBuffer = allTensorBuffers[1];
                    heatmapValuesBuffer = allTensorBuffers[2];
                    offsetPoints = decode_single_pose_util_1.getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
                    return [4 /*yield*/, offsetPoints.buffer()];
                case 2:
                    offsetPointsBuffer = _a.sent();
                    keypointConfidence = Array.from(decode_single_pose_util_1.getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
                    keypoints = keypointConfidence.map(function (score, keypointId) {
                        totalScore += score;
                        return {
                            y: offsetPointsBuffer.get(keypointId, 0),
                            x: offsetPointsBuffer.get(keypointId, 1),
                            score: score,
                            name: constants_1.COCO_KEYPOINTS[keypointId]
                        };
                    });
                    heatmapValues.dispose();
                    offsetPoints.dispose();
                    return [2 /*return*/, { keypoints: keypoints, score: totalScore / keypoints.length }];
            }
        });
    });
}
exports.decodeSinglePose = decodeSinglePose;
//# sourceMappingURL=decode_single_pose.js.map