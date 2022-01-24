"use strict";
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
exports.load = void 0;
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
var pose = require("@mediapipe/pose");
var tf = require("@tensorflow/tfjs-core");
var constants_1 = require("../constants");
var mask_util_1 = require("../shared/calculators/mask_util");
var detector_utils_1 = require("./detector_utils");
var BlazePoseMediaPipeMask = /** @class */ (function () {
    function BlazePoseMediaPipeMask(mask) {
        this.mask = mask;
    }
    BlazePoseMediaPipeMask.prototype.toCanvasImageSource = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mask];
            });
        });
    };
    BlazePoseMediaPipeMask.prototype.toImageData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mask_util_1.toImageDataLossy(this.mask)];
            });
        });
    };
    BlazePoseMediaPipeMask.prototype.toTensor = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mask_util_1.toTensorLossy(this.mask)];
            });
        });
    };
    BlazePoseMediaPipeMask.prototype.getUnderlyingType = function () {
        return 'canvasimagesource';
    };
    return BlazePoseMediaPipeMask;
}());
function maskValueToLabel(maskValue) {
    mask_util_1.assertMaskValue(maskValue);
    return 'person';
}
/**
 * MediaPipe detector class.
 */
var BlazePoseMediaPipeDetector = /** @class */ (function () {
    // Should not be called outside.
    function BlazePoseMediaPipeDetector(config) {
        var _this = this;
        // This will be filled out by asynchronous calls to onResults. They will be
        // stable after `await send` is called on the pose solution.
        this.width = 0;
        this.height = 0;
        this.selfieMode = false;
        this.poseSolution = new pose.Pose({
            locateFile: function (path, base) {
                if (config.solutionPath) {
                    var solutionPath = config.solutionPath.replace(/\/+$/, '');
                    return solutionPath + "/" + path;
                }
                return base + "/" + path;
            }
        });
        var modelComplexity;
        switch (config.modelType) {
            case 'lite':
                modelComplexity = 0;
                break;
            case 'heavy':
                modelComplexity = 2;
                break;
            case 'full':
            default:
                modelComplexity = 1;
                break;
        }
        this.poseSolution.setOptions({
            modelComplexity: modelComplexity,
            smoothLandmarks: config.enableSmoothing,
            enableSegmentation: config.enableSegmentation,
            smoothSegmentation: config.smoothSegmentation,
            selfieMode: this.selfieMode,
        });
        this.poseSolution.onResults(function (results) {
            _this.height = results.image.height;
            _this.width = results.image.width;
            if (results.poseLandmarks == null) {
                _this.poses = [];
            }
            else {
                var pose_1 = _this.translateOutput(results.poseLandmarks, results.poseWorldLandmarks);
                if (results.segmentationMask) {
                    pose_1.segmentation = {
                        maskValueToLabel: maskValueToLabel,
                        mask: new BlazePoseMediaPipeMask(results.segmentationMask)
                    };
                }
                _this.poses = [pose_1];
            }
        });
    }
    BlazePoseMediaPipeDetector.prototype.translateOutput = function (pose, pose3D) {
        var _this = this;
        var output = {
            keypoints: pose.map(function (landmark, i) { return ({
                x: landmark.x * _this.width,
                y: landmark.y * _this.height,
                z: landmark.z,
                score: landmark.visibility,
                name: constants_1.BLAZEPOSE_KEYPOINTS[i]
            }); })
        };
        if (pose3D != null) {
            output.keypoints3D = pose3D.map(function (landmark, i) { return ({
                x: landmark.x,
                y: landmark.y,
                z: landmark.z,
                score: landmark.visibility,
                name: constants_1.BLAZEPOSE_KEYPOINTS[i]
            }); });
        }
        return output;
    };
    /**
     * Estimates poses for an image or video frame.
     *
     * It returns a single pose or multiple poses based on the maxPose parameter
     * from the `config`.
     *
     * @param image
     * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
     * image to feed through the network.
     *
     * @param config Optional.
     *       maxPoses: Optional. Max number of poses to estimate.
     *       When maxPoses = 1, a single pose is detected, it is usually much
     *       more efficient than maxPoses > 1. When maxPoses > 1, multiple poses
     *       are detected.
     *
     *       flipHorizontal: Optional. Default to false. When image data comes
     *       from camera, the result has to flip horizontally.
     *
     *       enableSmoothing: Optional. Default to true. Smooth pose landmarks
     *       coordinates and visibility scores to reduce jitter.
     *
     * @param timestamp Optional. In milliseconds. This is useful when image is
     *     a tensor, which doesn't have timestamp info. Or to override timestamp
     *     in a video.
     *
     * @return An array of `Pose`s.
     */
    BlazePoseMediaPipeDetector.prototype.estimatePoses = function (image, estimationConfig, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (estimationConfig && estimationConfig.flipHorizontal &&
                            (estimationConfig.flipHorizontal !== this.selfieMode)) {
                            this.selfieMode = estimationConfig.flipHorizontal;
                            this.poseSolution.setOptions({
                                selfieMode: this.selfieMode,
                            });
                        }
                        if (!(image instanceof tf.Tensor)) return [3 /*break*/, 2];
                        _b = ImageData.bind;
                        return [4 /*yield*/, tf.browser.toPixels(image)];
                    case 1:
                        _a = new (_b.apply(ImageData, [void 0, _c.sent(), image.shape[1], image.shape[0]]))();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = image;
                        _c.label = 3;
                    case 3:
                        // Cast to GL TexImageSource types.
                        image = _a;
                        return [4 /*yield*/, this.poseSolution.send({ image: image }, timestamp)];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, this.poses];
                }
            });
        });
    };
    BlazePoseMediaPipeDetector.prototype.dispose = function () {
        this.poseSolution.close();
    };
    BlazePoseMediaPipeDetector.prototype.reset = function () {
        this.poseSolution.reset();
    };
    BlazePoseMediaPipeDetector.prototype.initialize = function () {
        return this.poseSolution.initialize();
    };
    return BlazePoseMediaPipeDetector;
}());
/**
 * Loads the MediaPipe solution.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the BlazePose loading process. Please find more details of each parameters
 * in the documentation of the `BlazePoseMediaPipeModelConfig` interface.
 */
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var config, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = detector_utils_1.validateModelConfig(modelConfig);
                    result = new BlazePoseMediaPipeDetector(config);
                    return [4 /*yield*/, result.initialize()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.load = load;
//# sourceMappingURL=detector.js.map