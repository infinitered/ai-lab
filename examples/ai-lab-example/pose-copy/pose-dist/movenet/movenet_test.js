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
var tf = require("@tensorflow/tfjs-core");
// tslint:disable-next-line: no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
// tslint:disable-next-line: no-imports-from-dist
var test_util_1 = require("@tensorflow/tfjs-core/dist/test_util");
var constants_1 = require("../constants");
var poseDetection = require("../index");
var test_util_2 = require("../shared/test_util");
var constants_2 = require("./constants");
var EPSILON_VIDEO = 60;
jasmine_util_1.describeWithFlags('MoveNet', jasmine_util_1.ALL_ENVS, function () {
    var detector;
    var timeout;
    beforeAll(function () {
        timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000; // 5mins
    });
    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: constants_2.SINGLEPOSE_LIGHTNING })];
                case 1:
                    // Note: this makes a network request for model assets.
                    detector = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('estimatePoses does not leak memory', function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, beforeTensors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = tf.zeros([128, 128, 3]);
                    beforeTensors = tf.memory().numTensors;
                    return [4 /*yield*/, detector.estimatePoses(input)];
                case 1:
                    _a.sent();
                    expect(tf.memory().numTensors).toEqual(beforeTensors);
                    return [2 /*return*/];
            }
        });
    }); });
});
jasmine_util_1.describeWithFlags('MoveNet video ', jasmine_util_1.BROWSER_ENVS, function () {
    var detector;
    var timeout;
    var expected;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2mins
                    return [4 /*yield*/, fetch(test_util_2.KARMA_SERVER + "/pose_1.json")
                            .then(function (response) { return response.json(); })
                            .then(function (result) {
                            return result.map(function (namedKeypoint) {
                                return constants_1.COCO_KEYPOINTS.map(function (name) {
                                    var keypoint = namedKeypoint[name];
                                    return [keypoint.x, keypoint.y];
                                });
                            });
                        })];
                case 1:
                    expected = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });
    it('test lightning.', function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, result, callback, simulatedInterval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = poseDetection.SupportedModels.MoveNet;
                    return [4 /*yield*/, poseDetection.createDetector(model, { modelType: constants_2.SINGLEPOSE_LIGHTNING })];
                case 1:
                    detector = _a.sent();
                    result = [];
                    callback = function (video, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
                        var poses;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, detector.estimatePoses(video, null /* config */, timestamp)];
                                case 1:
                                    poses = _a.sent();
                                    result.push(poses[0].keypoints.map(function (kp) { return [kp.x, kp.y]; }));
                                    return [2 /*return*/, poses[0].keypoints];
                            }
                        });
                    }); };
                    simulatedInterval = 33.3333;
                    // Synthetic video at 30FPS.
                    return [4 /*yield*/, test_util_2.loadVideo('pose_1.mp4', 30 /* fps */, callback, expected, poseDetection.util.getAdjacentPairs(model), simulatedInterval)];
                case 2:
                    // Synthetic video at 30FPS.
                    _a.sent();
                    test_util_1.expectArraysClose(result, expected, EPSILON_VIDEO);
                    detector.dispose();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=movenet_test.js.map