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
exports.getOffsetVectors = exports.getOffsetPoints = exports.getPointsConfidence = exports.argmax2d = void 0;
var tf = require("@tensorflow/tfjs-core");
var constants_1 = require("../../constants");
function mod(a, b) {
    return tf.tidy(function () {
        var floored = tf.div(a, tf.scalar(b, 'int32'));
        return tf.sub(a, tf.mul(floored, tf.scalar(b, 'int32')));
    });
}
function argmax2d(inputs) {
    var _a = inputs.shape, height = _a[0], width = _a[1], depth = _a[2];
    return tf.tidy(function () {
        var reshaped = tf.reshape(inputs, [height * width, depth]);
        var coords = tf.argMax(reshaped, 0);
        var yCoords = tf.expandDims(tf.div(coords, tf.scalar(width, 'int32')), 1);
        var xCoords = tf.expandDims(mod(coords, width), 1);
        return tf.concat([yCoords, xCoords], 1);
    });
}
exports.argmax2d = argmax2d;
function getPointsConfidence(heatmapScores, heatMapCoords) {
    var numKeypoints = heatMapCoords.shape[0];
    var result = new Float32Array(numKeypoints);
    for (var keypoint = 0; keypoint < numKeypoints; keypoint++) {
        var y = heatMapCoords.get(keypoint, 0);
        var x = heatMapCoords.get(keypoint, 1);
        result[keypoint] = heatmapScores.get(y, x, keypoint);
    }
    return result;
}
exports.getPointsConfidence = getPointsConfidence;
function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
    return tf.tidy(function () {
        var offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
        return tf.add(tf.cast(tf.mul(heatMapCoordsBuffer.toTensor(), tf.scalar(outputStride, 'int32')), 'float32'), offsetVectors);
    });
}
exports.getOffsetPoints = getOffsetPoints;
function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
    var result = [];
    for (var keypoint = 0; keypoint < constants_1.COCO_KEYPOINTS.length; keypoint++) {
        var heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
        var heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
        var _a = getOffsetPoint(heatmapY, heatmapX, keypoint, offsetsBuffer), x = _a.x, y = _a.y;
        result.push(y);
        result.push(x);
    }
    return tf.tensor2d(result, [constants_1.COCO_KEYPOINTS.length, 2]);
}
exports.getOffsetVectors = getOffsetVectors;
function getOffsetPoint(y, x, keypoint, offsetsBuffer) {
    return {
        y: offsetsBuffer.get(y, x, keypoint),
        x: offsetsBuffer.get(y, x, keypoint + constants_1.COCO_KEYPOINTS.length)
    };
}
//# sourceMappingURL=decode_single_pose_util.js.map