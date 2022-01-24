"use strict";
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
exports.EXPECTED_WORLD_LANDMARKS = exports.EXPECTED_LANDMARKS = void 0;
// tslint:disable-next-line: no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
// tslint:disable-next-line: no-imports-from-dist
var test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
var poseDetection = require("../index");
var mask_util_1 = require("../shared/calculators/mask_util");
var test_util_2 = require("../shared/test_util");
var MEDIAPIPE_MODEL_CONFIG = {
    runtime: 'mediapipe',
    solutionPath: 'base/node_modules/@mediapipe/pose',
    enableSegmentation: true,
};
// Measured in pixels.
var EPSILON_IMAGE = 11;
// Measured in meters.
var EPSILON_IMAGE_WORLD = 0.11;
// Measured in pixels.
var EPSILON_VIDEO = 31;
// Measured in meters.
var EPSILON_VIDEO_WORLD = 0.24;
// Measured in percent.
var EPSILON_IOU = 0.88;
// ref:
// https://github.com/google/mediapipe/blob/7c331ad58b2cca0dca468e342768900041d65adc/mediapipe/python/solutions/pose_test.py#L31-L51
exports.EXPECTED_LANDMARKS = [
    [460, 283], [467, 273], [471, 273], [474, 273], [465, 273], [465, 273],
    [466, 273], [491, 277], [480, 277], [470, 294], [465, 294], [545, 319],
    [453, 329], [622, 323], [375, 316], [696, 316], [299, 307], [719, 316],
    [278, 306], [721, 311], [274, 304], [713, 313], [283, 306], [520, 476],
    [467, 471], [612, 550], [358, 490], [701, 613], [349, 611], [709, 624],
    [363, 630], [730, 633], [303, 628]
];
exports.EXPECTED_WORLD_LANDMARKS = [
    [-0.11, -0.59, -0.15], [-0.09, -0.64, -0.16], [-0.09, -0.64, -0.16],
    [-0.09, -0.64, -0.16], [-0.11, -0.64, -0.14], [-0.11, -0.64, -0.14],
    [-0.11, -0.64, -0.14], [0.01, -0.65, -0.15], [-0.06, -0.64, -0.05],
    [-0.07, -0.57, -0.15], [-0.09, -0.57, -0.12], [0.18, -0.49, -0.09],
    [-0.14, -0.5, -0.03], [0.41, -0.48, -0.11], [-0.42, -0.5, -0.02],
    [0.64, -0.49, -0.17], [-0.63, -0.51, -0.13], [0.7, -0.5, -0.19],
    [-0.71, -0.53, -0.15], [0.72, -0.51, -0.23], [-0.69, -0.54, -0.19],
    [0.66, -0.49, -0.19], [-0.64, -0.52, -0.15], [0.09, 0., -0.04],
    [-0.09, -0., 0.03], [0.41, 0.23, -0.09], [-0.43, 0.1, -0.11],
    [0.69, 0.49, -0.04], [-0.48, 0.47, -0.02], [0.72, 0.52, -0.04],
    [-0.48, 0.51, -0.02], [0.8, 0.5, -0.14], [-0.59, 0.52, -0.11],
];
jasmine_util_1.describeWithFlags('MediaPipe Pose static image ', jasmine_util_1.BROWSER_ENVS, function () {
    var detector;
    var image;
    var segmentationImage;
    var timeout;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
                    return [4 /*yield*/, test_util_2.loadImage('pose.jpg', 1000, 667)];
                case 1:
                    image = _a.sent();
                    return [4 /*yield*/, test_util_2.loadImage('pose_segmentation.png', 1000, 667)];
                case 2:
                    segmentationImage = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test.', function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, result, xy, worldXyz, segmentation, maskValuesToLabel, mask, actualBooleanMask, _a, expectedBooleanMask, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    model = poseDetection.SupportedModels.BlazePose;
                    return [4 /*yield*/, poseDetection.createDetector(model, MEDIAPIPE_MODEL_CONFIG)];
                case 1:
                    detector =
                        _c.sent();
                    return [4 /*yield*/, detector.estimatePoses(image, {})];
                case 2:
                    result = _c.sent();
                    xy = result[0].keypoints.map(function (keypoint) { return [keypoint.x, keypoint.y]; });
                    worldXyz = result[0].keypoints3D.map(function (keypoint) { return [keypoint.x, keypoint.y, keypoint.z]; });
                    segmentation = result[0].segmentation;
                    maskValuesToLabel = Array.from(Array(256).keys(), function (v, _) { return segmentation.maskValueToLabel(v); });
                    mask = segmentation.mask;
                    _a = test_util_2.imageToBooleanMask;
                    return [4 /*yield*/, segmentation.mask.toImageData()];
                case 3:
                    actualBooleanMask = _a.apply(void 0, [(_c.sent()).data, 255, 0, 0]);
                    _b = test_util_2.imageToBooleanMask;
                    return [4 /*yield*/, mask_util_1.toImageDataLossy(segmentationImage)];
                case 4:
                    expectedBooleanMask = _b.apply(void 0, [(_c.sent()).data, 0, 0, 255]);
                    test_util_1.expectArraysClose(xy, exports.EXPECTED_LANDMARKS, EPSILON_IMAGE);
                    test_util_1.expectArraysClose(worldXyz, exports.EXPECTED_WORLD_LANDMARKS, EPSILON_IMAGE_WORLD);
                    expect(maskValuesToLabel.every(function (label) { return label === 'person'; }));
                    expect(mask.getUnderlyingType() === 'canvasimagesource');
                    expect(test_util_2.segmentationIOU(expectedBooleanMask, actualBooleanMask))
                        .toBeGreaterThanOrEqual(EPSILON_IOU);
                    detector.dispose();
                    return [2 /*return*/];
            }
        });
    }); });
});
jasmine_util_1.describeWithFlags('MediaPipe Pose video ', jasmine_util_1.BROWSER_ENVS, function () {
    var detector;
    var timeout;
    var expected;
    var expected3D;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
                    return [4 /*yield*/, fetch(test_util_2.KARMA_SERVER + "/pose_squats.full.json")
                            .then(function (response) { return response.json(); })
                            .then(function (result) { return test_util_2.getXYPerFrame(result); })];
                case 1:
                    expected = _a.sent();
                    return [4 /*yield*/, fetch(test_util_2.KARMA_SERVER + "/pose_squats_3d.full.json")
                            .then(function (response) { return response.json(); })];
                case 2:
                    expected3D = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test.', function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, result, result3D, callback, simulatedInterval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = poseDetection.SupportedModels.BlazePose;
                    return [4 /*yield*/, poseDetection.createDetector(model, MEDIAPIPE_MODEL_CONFIG)];
                case 1:
                    detector =
                        _a.sent();
                    result = [];
                    result3D = [];
                    callback = function (video, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
                        var poses;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, detector.estimatePoses(video, null /* config */, timestamp)];
                                case 1:
                                    poses = _a.sent();
                                    // BlazePose only returns single pose for now.
                                    result.push(poses[0].keypoints.map(function (kp) { return [kp.x, kp.y]; }));
                                    result3D.push(poses[0].keypoints3D.map(function (kp) { return [kp.x, kp.y, kp.z]; }));
                                    return [2 /*return*/, poses[0].keypoints];
                            }
                        });
                    }); };
                    simulatedInterval = 33.3333;
                    // Original video source in 720 * 1280 resolution:
                    // https://www.pexels.com/video/woman-doing-squats-4838220/ Video is
                    // compressed to be smaller with less frames (5fps), using below command:
                    // `ffmpeg -i original_pose.mp4 -r 5 -vcodec libx264 -crf 28 -profile:v
                    // baseline pose_squats.mp4`
                    return [4 /*yield*/, test_util_2.loadVideo('pose_squats.mp4', 5 /* fps */, callback, expected, poseDetection.util.getAdjacentPairs(model), simulatedInterval)];
                case 2:
                    // Original video source in 720 * 1280 resolution:
                    // https://www.pexels.com/video/woman-doing-squats-4838220/ Video is
                    // compressed to be smaller with less frames (5fps), using below command:
                    // `ffmpeg -i original_pose.mp4 -r 5 -vcodec libx264 -crf 28 -profile:v
                    // baseline pose_squats.mp4`
                    _a.sent();
                    test_util_1.expectArraysClose(result, expected, EPSILON_VIDEO);
                    test_util_1.expectArraysClose(result3D, expected3D, EPSILON_VIDEO_WORLD);
                    detector.dispose();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=mediapipe_test.js.map