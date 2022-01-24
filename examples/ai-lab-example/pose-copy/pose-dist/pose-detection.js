/**
    * @license
    * Copyright 2022 Google LLC. All Rights Reserved.
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
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@mediapipe/pose'), require('@tensorflow/tfjs-core'), require('@tensorflow/tfjs-converter')) :
    typeof define === 'function' && define.amd ? define(['exports', '@mediapipe/pose', '@tensorflow/tfjs-core', '@tensorflow/tfjs-converter'], factory) :
    (global = global || self, factory(global.poseDetection = {}, global.Pose, global.tf, global.tf));
}(this, (function (exports, pose, tf, tfconv) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
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
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

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
    // Don't change the order. The order needs to be consistent with the model
    // keypoint result list.
    var COCO_KEYPOINTS = [
        'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear', 'left_shoulder',
        'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist',
        'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle',
        'right_ankle'
    ];
    // Don't change the order. The order needs to be consistent with the model
    // keypoint result list.
    var BLAZEPOSE_KEYPOINTS = [
        'nose',
        'left_eye_inner',
        'left_eye',
        'left_eye_outer',
        'right_eye_inner',
        'right_eye',
        'right_eye_outer',
        'left_ear',
        'right_ear',
        'mouth_left',
        'mouth_right',
        'left_shoulder',
        'right_shoulder',
        'left_elbow',
        'right_elbow',
        'left_wrist',
        'right_wrist',
        'left_pinky',
        'right_pinky',
        'left_index',
        'right_index',
        'left_thumb',
        'right_thumb',
        'left_hip',
        'right_hip',
        'left_knee',
        'right_knee',
        'left_ankle',
        'right_ankle',
        'left_heel',
        'right_heel',
        'left_foot_index',
        'right_foot_index'
    ];
    var BLAZEPOSE_KEYPOINTS_BY_SIDE = {
        left: [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
        right: [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
        middle: [0]
    };
    var COCO_KEYPOINTS_BY_SIDE = {
        left: [1, 3, 5, 7, 9, 11, 13, 15],
        right: [2, 4, 6, 8, 10, 12, 14, 16],
        middle: [0]
    };
    var COCO_CONNECTED_KEYPOINTS_PAIRS = [
        [0, 1], [0, 2], [1, 3], [2, 4], [5, 6], [5, 7], [5, 11], [6, 8], [6, 12],
        [7, 9], [8, 10], [11, 12], [11, 13], [12, 14], [13, 15], [14, 16]
    ];
    var BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS = [
        [0, 1], [0, 4], [1, 2], [2, 3], [3, 7], [4, 5],
        [5, 6], [6, 8], [9, 10], [11, 12], [11, 13], [11, 23],
        [12, 14], [14, 16], [12, 24], [13, 15], [15, 17], [16, 18],
        [16, 20], [15, 17], [15, 19], [15, 21], [16, 22], [17, 19],
        [18, 20], [23, 25], [23, 24], [24, 26], [25, 27], [26, 28],
        [27, 29], [28, 30], [27, 31], [28, 32], [29, 31], [30, 32]
    ];

    function toNumber(value) {
        return value instanceof SVGAnimatedLength ? value.baseVal.value : value;
    }
    /**
     * Converts input image to an HTMLCanvasElement. Note that converting
     * back from the output of this function to imageData or a Tensor will be lossy
     * due to premultiplied alpha color values. For more details please reference:
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
     * @param image Input image.
     *
     * @returns Converted HTMLCanvasElement.
     */
    function toHTMLCanvasElementLossy(image) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = document.createElement('canvas');
                        if (!(image instanceof tf.Tensor)) return [3 /*break*/, 2];
                        return [4 /*yield*/, tf.browser.toPixels(image, canvas)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        canvas.width = toNumber(image.width);
                        canvas.height = toNumber(image.height);
                        ctx = canvas.getContext('2d');
                        if (image instanceof ImageData) {
                            ctx.putImageData(image, 0, 0);
                        }
                        else {
                            ctx.drawImage(image, 0, 0);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, canvas];
                }
            });
        });
    }
    /**
     * Converts input image to ImageData. Note that converting
     * from a CanvasImageSource will be lossy due to premultiplied alpha color
     * values. For more details please reference:
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
     * @param image Input image.
     *
     * @returns Converted ImageData.
     */
    function toImageDataLossy(image) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, height, width, _b, canvas, ctx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(image instanceof tf.Tensor)) return [3 /*break*/, 2];
                        _a = image.shape.slice(0, 2), height = _a[0], width = _a[1];
                        _b = ImageData.bind;
                        return [4 /*yield*/, tf.browser.toPixels(image)];
                    case 1: return [2 /*return*/, new (_b.apply(ImageData, [void 0, _c.sent(), width, height]))()];
                    case 2:
                        canvas = document.createElement('canvas');
                        ctx = canvas.getContext('2d');
                        canvas.width = toNumber(image.width);
                        canvas.height = toNumber(image.height);
                        ctx.drawImage(image, 0, 0);
                        return [2 /*return*/, ctx.getImageData(0, 0, canvas.width, canvas.height)];
                }
            });
        });
    }
    /**
     * Converts input image to Tensor. Note that converting
     * from a CanvasImageSource will be lossy due to premultiplied alpha color
     * values. For more details please reference:
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
     * @param image Input image.
     *
     * @returns Converted Tensor.
     */
    function toTensorLossy(image) {
        return __awaiter(this, void 0, void 0, function () {
            var pixelsInput, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(image instanceof SVGImageElement || image instanceof OffscreenCanvas)) return [3 /*break*/, 2];
                        return [4 /*yield*/, toHTMLCanvasElementLossy(image)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = image;
                        _b.label = 3;
                    case 3:
                        pixelsInput = _a;
                        return [2 /*return*/, tf.browser.fromPixels(pixelsInput, 4)];
                }
            });
        });
    }
    function assertMaskValue(maskValue) {
        if (maskValue < 0 || maskValue >= 256) {
            throw new Error("Mask value must be in range [0, 255] but got " + maskValue);
        }
        if (!Number.isInteger(maskValue)) {
            throw new Error("Mask value must be an integer but got " + maskValue);
        }
    }

    var DEFAULT_BLAZEPOSE_MODEL_CONFIG = {
        runtime: 'mediapipe',
        enableSmoothing: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        modelType: 'full'
    };

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
    function validateModelConfig(modelConfig) {
        if (modelConfig == null) {
            return __assign({}, DEFAULT_BLAZEPOSE_MODEL_CONFIG);
        }
        var config = __assign({}, modelConfig);
        config.runtime = 'mediapipe';
        if (config.enableSegmentation == null) {
            config.enableSegmentation =
                DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSegmentation;
        }
        if (config.enableSmoothing == null) {
            config.enableSmoothing = DEFAULT_BLAZEPOSE_MODEL_CONFIG.enableSmoothing;
        }
        if (config.smoothSegmentation == null) {
            config.smoothSegmentation =
                DEFAULT_BLAZEPOSE_MODEL_CONFIG.smoothSegmentation;
        }
        if (config.modelType == null) {
            config.modelType = DEFAULT_BLAZEPOSE_MODEL_CONFIG.modelType;
        }
        return config;
    }

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
                    return [2 /*return*/, toImageDataLossy(this.mask)];
                });
            });
        };
        BlazePoseMediaPipeMask.prototype.toTensor = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, toTensorLossy(this.mask)];
                });
            });
        };
        BlazePoseMediaPipeMask.prototype.getUnderlyingType = function () {
            return 'canvasimagesource';
        };
        return BlazePoseMediaPipeMask;
    }());
    function maskValueToLabel(maskValue) {
        assertMaskValue(maskValue);
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
                    name: BLAZEPOSE_KEYPOINTS[i]
                }); })
            };
            if (pose3D != null) {
                output.keypoints3D = pose3D.map(function (landmark, i) { return ({
                    x: landmark.x,
                    y: landmark.y,
                    z: landmark.z,
                    score: landmark.visibility,
                    name: BLAZEPOSE_KEYPOINTS[i]
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
                        config = validateModelConfig(modelConfig);
                        result = new BlazePoseMediaPipeDetector(config);
                        return [4 /*yield*/, result.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }

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
    function getImageSize(input) {
        if (input instanceof tf.Tensor) {
            return { height: input.shape[0], width: input.shape[1] };
        }
        else {
            return { height: input.height, width: input.width };
        }
    }
    /**
     * Normalizes the provided angle to the range -pi to pi.
     * @param angle The angle in radians to be normalized.
     */
    function normalizeRadians(angle) {
        return angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI));
    }
    /**
     * Transform value ranges.
     * @param fromMin Min of original value range.
     * @param fromMax Max of original value range.
     * @param toMin New min of transformed value range.
     * @param toMax New max of transformed value range.
     */
    function transformValueRange(fromMin, fromMax, toMin, toMax) {
        var fromRange = fromMax - fromMin;
        var toRange = toMax - toMin;
        if (fromRange === 0) {
            throw new Error("Original min and max are both " + fromMin + ", range cannot be 0.");
        }
        var scale = toRange / fromRange;
        var offset = toMin - fromMin * scale;
        return { scale: scale, offset: offset };
    }
    /**
     * Convert an image to an image tensor representation.
     *
     * The image tensor has a shape [1, height, width, colorChannel].
     *
     * @param input An image, video frame, or image tensor.
     */
    function toImageTensor(input) {
        return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
    }
    /**
     * Padding ratio of left, top, right, bottom, based on the output dimensions.
     *
     * The padding values are non-zero only when the "keep_aspect_ratio" is true.
     *
     * For instance, when the input image is 10x10 (width x height) and the
     * output dimensions is 20x40 and "keep_aspect_ratio" is true, we should scale
     * the input image to 20x20 and places it in the middle of the output image with
     * an equal padding of 10 pixels at the top and the bottom. The result is
     * therefore {left: 0, top: 0.25, right: 0, bottom: 0.25} (10/40 = 0.25f).
     * @param roi The original rectangle to pad.
     * @param targetSize The target width and height of the result rectangle.
     * @param keepAspectRatio Whether keep aspect ratio. Default to false.
     */
    function padRoi(roi, targetSize, keepAspectRatio) {
        if (keepAspectRatio === void 0) { keepAspectRatio = false; }
        if (!keepAspectRatio) {
            return { top: 0, left: 0, right: 0, bottom: 0 };
        }
        var targetH = targetSize.height;
        var targetW = targetSize.width;
        validateSize(targetSize, 'targetSize');
        validateSize(roi, 'roi');
        var tensorAspectRatio = targetH / targetW;
        var roiAspectRatio = roi.height / roi.width;
        var newWidth;
        var newHeight;
        var horizontalPadding = 0;
        var verticalPadding = 0;
        if (tensorAspectRatio > roiAspectRatio) {
            // pad height;
            newWidth = roi.width;
            newHeight = roi.width * tensorAspectRatio;
            verticalPadding = (1 - roiAspectRatio / tensorAspectRatio) / 2;
        }
        else {
            // pad width.
            newWidth = roi.height / tensorAspectRatio;
            newHeight = roi.height;
            horizontalPadding = (1 - tensorAspectRatio / roiAspectRatio) / 2;
        }
        roi.width = newWidth;
        roi.height = newHeight;
        return {
            top: verticalPadding,
            left: horizontalPadding,
            right: horizontalPadding,
            bottom: verticalPadding
        };
    }
    /**
     * Get the rectangle information of an image, including xCenter, yCenter, width,
     * height and rotation.
     *
     * @param imageSize imageSize is used to calculate the rectangle.
     * @param normRect Optional. If normRect is not null, it will be used to get
     *     a subarea rectangle information in the image. `imageSize` is used to
     *     calculate the actual non-normalized coordinates.
     */
    function getRoi(imageSize, normRect) {
        if (normRect) {
            return {
                xCenter: normRect.xCenter * imageSize.width,
                yCenter: normRect.yCenter * imageSize.height,
                width: normRect.width * imageSize.width,
                height: normRect.height * imageSize.height,
                rotation: normRect.rotation
            };
        }
        else {
            return {
                xCenter: 0.5 * imageSize.width,
                yCenter: 0.5 * imageSize.height,
                width: imageSize.width,
                height: imageSize.height,
                rotation: 0
            };
        }
    }
    /**
     * Generate the projective transformation matrix to be used for `tf.transform`.
     *
     * See more documentation in `tf.transform`.
     *
     * @param matrix The transformation matrix mapping subRect to rect, can be
     *     computed using `getRotatedSubRectToRectTransformMatrix` calculator.
     * @param imageSize The original image height and width.
     * @param inputResolution The target height and width.
     */
    function getProjectiveTransformMatrix(matrix, imageSize, inputResolution) {
        validateSize(inputResolution, 'inputResolution');
        // To use M with regular x, y coordinates, we need to normalize them first.
        // Because x' = a0 * x + a1 * y + a2, y' = b0 * x + b1 * y + b2,
        // we need to use factor (1/inputResolution.width) to normalize x for a0 and
        // b0, similarly we need to use factor (1/inputResolution.height) to normalize
        // y for a1 and b1.
        // Also at the end, we need to de-normalize x' and y' to regular coordinates.
        // So we need to use factor imageSize.width for a0, a1 and a2, similarly
        // we need to use factor imageSize.height for b0, b1 and b2.
        var a0 = (1 / inputResolution.width) * matrix[0][0] * imageSize.width;
        var a1 = (1 / inputResolution.height) * matrix[0][1] * imageSize.width;
        var a2 = matrix[0][3] * imageSize.width;
        var b0 = (1 / inputResolution.width) * matrix[1][0] * imageSize.height;
        var b1 = (1 / inputResolution.height) * matrix[1][1] * imageSize.height;
        var b2 = matrix[1][3] * imageSize.height;
        return [a0, a1, a2, b0, b1, b2, 0, 0];
    }
    function validateSize(size, name) {
        tf.util.assert(size.width !== 0, function () { return name + " width cannot be 0."; });
        tf.util.assert(size.height !== 0, function () { return name + " height cannot be 0."; });
    }

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
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/detections_to_rects_calculator.cc
    function computeRotation(detection, imageSize, config) {
        var locationData = detection.locationData;
        var startKeypoint = config.rotationVectorStartKeypointIndex;
        var endKeypoint = config.rotationVectorEndKeypointIndex;
        var targetAngle;
        if (config.rotationVectorTargetAngle) {
            targetAngle = config.rotationVectorTargetAngle;
        }
        else {
            targetAngle = Math.PI * config.rotationVectorTargetAngleDegree / 180;
        }
        var x0 = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
        var y0 = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
        var x1 = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
        var y1 = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;
        var rotation = normalizeRadians(targetAngle - Math.atan2(-(y1 - y0), x1 - x0));
        return rotation;
    }

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
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/alignment_points_to_rects_calculator.cc
    function calculateAlignmentPointsRects(detection, imageSize, config) {
        var startKeypoint = config.rotationVectorStartKeypointIndex;
        var endKeypoint = config.rotationVectorEndKeypointIndex;
        var locationData = detection.locationData;
        var xCenter = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
        var yCenter = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
        var xScale = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
        var yScale = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;
        // Bounding box size as double distance from center to scale point.
        var boxSize = Math.sqrt((xScale - xCenter) * (xScale - xCenter) +
            (yScale - yCenter) * (yScale - yCenter)) *
            2;
        var rotation = computeRotation(detection, imageSize, config);
        // Set resulting bounding box.
        return {
            xCenter: xCenter / imageSize.width,
            yCenter: yCenter / imageSize.height,
            width: boxSize / imageSize.width,
            height: boxSize / imageSize.height,
            rotation: rotation
        };
    }

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
    function arrayToMatrix4x4(array) {
        if (array.length !== 16) {
            throw new Error("Array length must be 16 but got " + array.length);
        }
        return [
            [array[0], array[1], array[2], array[3]],
            [array[4], array[5], array[6], array[7]],
            [array[8], array[9], array[10], array[11]],
            [array[12], array[13], array[14], array[15]],
        ];
    }
    function generalDet3Helper(matrix, i1, i2, i3, j1, j2, j3) {
        return matrix[i1][j1] *
            (matrix[i2][j2] * matrix[i3][j3] - matrix[i2][j3] * matrix[i3][j2]);
    }
    function cofactor4x4(matrix, i, j) {
        var i1 = (i + 1) % 4, i2 = (i + 2) % 4, i3 = (i + 3) % 4, j1 = (j + 1) % 4, j2 = (j + 2) % 4, j3 = (j + 3) % 4;
        return generalDet3Helper(matrix, i1, i2, i3, j1, j2, j3) +
            generalDet3Helper(matrix, i2, i3, i1, j1, j2, j3) +
            generalDet3Helper(matrix, i3, i1, i2, j1, j2, j3);
    }
    /**
     * Calculates inverse of an invertible 4x4 matrix.
     * @param matrix 4x4 matrix to invert.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/inverse_matrix_calculator.cc
    // https://gitlab.com/libeigen/eigen/-/blob/master/Eigen/src/LU/InverseImpl.h
    function calculateInverseMatrix(matrix) {
        var inverse = arrayToMatrix4x4(new Array(16).fill(0));
        inverse[0][0] = cofactor4x4(matrix, 0, 0);
        inverse[1][0] = -cofactor4x4(matrix, 0, 1);
        inverse[2][0] = cofactor4x4(matrix, 0, 2);
        inverse[3][0] = -cofactor4x4(matrix, 0, 3);
        inverse[0][2] = cofactor4x4(matrix, 2, 0);
        inverse[1][2] = -cofactor4x4(matrix, 2, 1);
        inverse[2][2] = cofactor4x4(matrix, 2, 2);
        inverse[3][2] = -cofactor4x4(matrix, 2, 3);
        inverse[0][1] = -cofactor4x4(matrix, 1, 0);
        inverse[1][1] = cofactor4x4(matrix, 1, 1);
        inverse[2][1] = -cofactor4x4(matrix, 1, 2);
        inverse[3][1] = cofactor4x4(matrix, 1, 3);
        inverse[0][3] = -cofactor4x4(matrix, 3, 0);
        inverse[1][3] = cofactor4x4(matrix, 3, 1);
        inverse[2][3] = -cofactor4x4(matrix, 3, 2);
        inverse[3][3] = cofactor4x4(matrix, 3, 3);
        var scale = matrix[0][0] * inverse[0][0] + matrix[1][0] * inverse[0][1] +
            matrix[2][0] * inverse[0][2] + matrix[3][0] * inverse[0][3];
        for (var i = 0; i < inverse.length; i++) {
            for (var j = 0; j < inverse.length; j++) {
                inverse[i][j] /= scale;
            }
        }
        return inverse;
    }

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
     * Projects normalized landmarks in a rectangle to its original coordinates. The
     * rectangle must also be in normalized coordinates.
     * @param landmarks A normalized Landmark list representing landmarks in a
     *     normalized rectangle.
     * @param inputRect A normalized rectangle.
     * @param config Config object has one field ignoreRotation, default to false.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmark_projection_calculator.cc
    function calculateLandmarkProjection(landmarks, inputRect, config) {
        if (config === void 0) { config = {
            ignoreRotation: false
        }; }
        var outputLandmarks = [];
        for (var _i = 0, landmarks_1 = landmarks; _i < landmarks_1.length; _i++) {
            var landmark = landmarks_1[_i];
            var x = landmark.x - 0.5;
            var y = landmark.y - 0.5;
            var angle = config.ignoreRotation ? 0 : inputRect.rotation;
            var newX = Math.cos(angle) * x - Math.sin(angle) * y;
            var newY = Math.sin(angle) * x + Math.cos(angle) * y;
            newX = newX * inputRect.width + inputRect.xCenter;
            newY = newY * inputRect.height + inputRect.yCenter;
            var newZ = landmark.z * inputRect.width; // Scale Z coordinate as x.
            var newLandmark = __assign({}, landmark);
            newLandmark.x = newX;
            newLandmark.y = newY;
            newLandmark.z = newZ;
            outputLandmarks.push(newLandmark);
        }
        return outputLandmarks;
    }

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
     * A calculator to copy score between landmarks.
     *
     * Landmarks to copy from and to copy to can be of different type (normalized or
     * non-normalized), but landmarks to copy to and output landmarks should be of
     * the same type.
     * @param landmarksFrom  A list of landmarks.
     *     to copy from.
     * @param landmarksTo  A list of landmarks.
     *     to copy to.
     * @param copyScore Copy the score from the `landmarksFrom` parameter.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/visibility_copy_calculator.cc
    function calculateScoreCopy(landmarksFrom, landmarksTo, copyScore) {
        if (copyScore === void 0) { copyScore = true; }
        var outputLandmarks = [];
        for (var i = 0; i < landmarksFrom.length; i++) {
            // Create output landmark and copy all fields from the `to` landmarks
            var newLandmark = __assign({}, landmarksTo[i]);
            // Copy score from the `from` landmark.
            if (copyScore) {
                newLandmark.score = landmarksFrom[i].score;
            }
            outputLandmarks.push(newLandmark);
        }
        return outputLandmarks;
    }

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
     * Projects world landmarks from the rectangle to original coordinates.
     *
     * World landmarks are predicted in meters rather than in pixels of the image
     * and have origin in the middle of the hips rather than in the corner of the
     * pose image (cropped with given rectangle). Thus only rotation (but not scale
     * and translation) is applied to the landmarks to transform them back to
     * original coordinates.
     * @param worldLandmarks A Landmark list representing world landmarks in the
     *     rectangle.
     * @param inputRect A normalized rectangle.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmark_projection_calculator.cc
    function calculateWorldLandmarkProjection(worldLandmarks, inputRect) {
        var outputLandmarks = [];
        for (var _i = 0, worldLandmarks_1 = worldLandmarks; _i < worldLandmarks_1.length; _i++) {
            var worldLandmark = worldLandmarks_1[_i];
            var x = worldLandmark.x;
            var y = worldLandmark.y;
            var angle = inputRect.rotation;
            var newX = Math.cos(angle) * x - Math.sin(angle) * y;
            var newY = Math.sin(angle) * x + Math.cos(angle) * y;
            var newLandmark = __assign({}, worldLandmark);
            newLandmark.x = newX;
            newLandmark.y = newY;
            outputLandmarks.push(newLandmark);
        }
        return outputLandmarks;
    }

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
    var MICRO_SECONDS_TO_SECOND = 1e-6;
    var SECOND_TO_MICRO_SECONDS = 1e6;
    var MILLISECOND_TO_MICRO_SECONDS = 1000;

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
     * Generates a 4x4 projective transform matrix M, so that for any point in the
     * subRect image p(x, y), we can use the matrix to calculate the projected point
     * in the original image p' (x', y'): p' = p * M;
     *
     * @param subRect Rotated sub rect in absolute coordinates.
     * @param rectWidth
     * @param rectHeight
     * @param flipHorizontaly Whether to flip the image horizontally.
     */
    // Ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/tensor/image_to_tensor_utils.h
    function getRotatedSubRectToRectTransformMatrix(subRect, rectWidth, rectHeight, flipHorizontally) {
        // The resulting matrix is multiplication of below commented out matrices:
        //   postScaleMatrix
        //     * translateMatrix
        //     * rotateMatrix
        //     * flipMatrix
        //     * scaleMatrix
        //     * initialTranslateMatrix
        // For any point in the transformed image p, we can use the above matrix to
        // calculate the projected point in the original image p'. So that:
        // p' = p * M;
        // Note: The transform matrix below assumes image coordinates is normalized
        // to [0, 1] range.
        // Matrix to convert X,Y to [-0.5, 0.5] range "initialTranslateMatrix"
        // [ 1.0,  0.0, 0.0, -0.5]
        // [ 0.0,  1.0, 0.0, -0.5]
        // [ 0.0,  0.0, 1.0,  0.0]
        // [ 0.0,  0.0, 0.0,  1.0]
        var a = subRect.width;
        var b = subRect.height;
        // Matrix to scale X,Y,Z to sub rect "scaleMatrix"
        // Z has the same scale as X.
        // [   a, 0.0, 0.0, 0.0]
        // [0.0,    b, 0.0, 0.0]
        // [0.0, 0.0,    a, 0.0]
        // [0.0, 0.0, 0.0, 1.0]
        var flip = flipHorizontally ? -1 : 1;
        // Matrix for optional horizontal flip around middle of output image.
        // [ fl  , 0.0, 0.0, 0.0]
        // [ 0.0, 1.0, 0.0, 0.0]
        // [ 0.0, 0.0, 1.0, 0.0]
        // [ 0.0, 0.0, 0.0, 1.0]
        var c = Math.cos(subRect.rotation);
        var d = Math.sin(subRect.rotation);
        // Matrix to do rotation around Z axis "rotateMatrix"
        // [    c,   -d, 0.0, 0.0]
        // [    d,    c, 0.0, 0.0]
        // [ 0.0, 0.0, 1.0, 0.0]
        // [ 0.0, 0.0, 0.0, 1.0]
        var e = subRect.xCenter;
        var f = subRect.yCenter;
        // Matrix to do X,Y translation of sub rect within parent rect
        // "translateMatrix"
        // [1.0, 0.0, 0.0, e   ]
        // [0.0, 1.0, 0.0, f   ]
        // [0.0, 0.0, 1.0, 0.0]
        // [0.0, 0.0, 0.0, 1.0]
        var g = 1.0 / rectWidth;
        var h = 1.0 / rectHeight;
        // Matrix to scale X,Y,Z to [0.0, 1.0] range "postScaleMatrix"
        // [g,    0.0, 0.0, 0.0]
        // [0.0, h,    0.0, 0.0]
        // [0.0, 0.0,    g, 0.0]
        // [0.0, 0.0, 0.0, 1.0]
        var matrix = new Array(16);
        // row 1
        matrix[0] = a * c * flip * g;
        matrix[1] = -b * d * g;
        matrix[2] = 0.0;
        matrix[3] = (-0.5 * a * c * flip + 0.5 * b * d + e) * g;
        // row 2
        matrix[4] = a * d * flip * h;
        matrix[5] = b * c * h;
        matrix[6] = 0.0;
        matrix[7] = (-0.5 * b * c - 0.5 * a * d * flip + f) * h;
        // row 3
        matrix[8] = 0.0;
        matrix[9] = 0.0;
        matrix[10] = a * g;
        matrix[11] = 0.0;
        // row 4
        matrix[12] = 0.0;
        matrix[13] = 0.0;
        matrix[14] = 0.0;
        matrix[15] = 1.0;
        return arrayToMatrix4x4(matrix);
    }

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
    function shiftImageValue(image, outputFloatRange) {
        // Calculate the scale and offset to shift from [0, 255] to [-1, 1].
        var valueRange = transformValueRange(0, 255, outputFloatRange[0] /* min */, outputFloatRange[1] /* max */);
        // Shift value range.
        return tf.tidy(function () { return tf.add(tf.mul(image, valueRange.scale), valueRange.offset); });
    }

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
     * Convert an image or part of it to an image tensor.
     *
     * @param image An image, video frame or image tensor.
     * @param config
     *      inputResolution: The target height and width.
     *      keepAspectRatio?: Whether target tensor should keep aspect ratio.
     * @param normRect A normalized rectangle, representing the subarea to crop from
     *      the image. If normRect is provided, the returned image tensor represents
     *      the subarea.
     * @returns A map with the following properties:
     *     - imageTensor
     *     - padding: Padding ratio of left, top, right, bottom, based on the output
     * dimensions.
     *     - transformationMatrix: Projective transform matrix used to transform
     * input image to transformed image.
     */
    function convertImageToTensor(image, config, normRect) {
        var outputTensorSize = config.outputTensorSize, keepAspectRatio = config.keepAspectRatio, borderMode = config.borderMode, outputTensorFloatRange = config.outputTensorFloatRange;
        // Ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/tensor/image_to_tensor_calculator.cc
        var imageSize = getImageSize(image);
        var roi = getRoi(imageSize, normRect);
        var padding = padRoi(roi, outputTensorSize, keepAspectRatio);
        var transformationMatrix = getRotatedSubRectToRectTransformMatrix(roi, imageSize.width, imageSize.height, false);
        var imageTensor = tf.tidy(function () {
            var $image = toImageTensor(image);
            var transformMatrix = tf.tensor2d(getProjectiveTransformMatrix(transformationMatrix, imageSize, outputTensorSize), [1, 8]);
            var fillMode = borderMode === 'zero' ? 'constant' : 'nearest';
            var imageTransformed = tf.image.transform(
            // tslint:disable-next-line: no-unnecessary-type-assertion
            tf.expandDims(tf.cast($image, 'float32')), transformMatrix, 'bilinear', fillMode, 0, [outputTensorSize.height, outputTensorSize.width]);
            var imageShifted = outputTensorFloatRange != null ?
                shiftImageValue(imageTransformed, outputTensorFloatRange) :
                imageTransformed;
            return imageShifted;
        });
        return { imageTensor: imageTensor, padding: padding, transformationMatrix: transformationMatrix };
    }

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
    // ref:
    // https://github.com/google/mediapipe/blob/350fbb2100ad531bc110b93aaea23d96af5a5064/mediapipe/calculators/tflite/ssd_anchors_calculator.cc
    function createSsdAnchors(config) {
        // Set defaults.
        if (config.reduceBoxesInLowestLayer == null) {
            config.reduceBoxesInLowestLayer = false;
        }
        if (config.interpolatedScaleAspectRatio == null) {
            config.interpolatedScaleAspectRatio = 1.0;
        }
        if (config.fixedAnchorSize == null) {
            config.fixedAnchorSize = false;
        }
        var anchors = [];
        var layerId = 0;
        while (layerId < config.numLayers) {
            var anchorHeight = [];
            var anchorWidth = [];
            var aspectRatios = [];
            var scales = [];
            // For same strides, we merge the anchors in the same order.
            var lastSameStrideLayer = layerId;
            while (lastSameStrideLayer < config.strides.length &&
                config.strides[lastSameStrideLayer] === config.strides[layerId]) {
                var scale = calculateScale(config.minScale, config.maxScale, lastSameStrideLayer, config.strides.length);
                if (lastSameStrideLayer === 0 && config.reduceBoxesInLowestLayer) {
                    // For first layer, it can be specified to use predefined anchors.
                    aspectRatios.push(1);
                    aspectRatios.push(2);
                    aspectRatios.push(0.5);
                    scales.push(0.1);
                    scales.push(scale);
                    scales.push(scale);
                }
                else {
                    for (var aspectRatioId = 0; aspectRatioId < config.aspectRatios.length; ++aspectRatioId) {
                        aspectRatios.push(config.aspectRatios[aspectRatioId]);
                        scales.push(scale);
                    }
                    if (config.interpolatedScaleAspectRatio > 0.0) {
                        var scaleNext = lastSameStrideLayer === config.strides.length - 1 ?
                            1.0 :
                            calculateScale(config.minScale, config.maxScale, lastSameStrideLayer + 1, config.strides.length);
                        scales.push(Math.sqrt(scale * scaleNext));
                        aspectRatios.push(config.interpolatedScaleAspectRatio);
                    }
                }
                lastSameStrideLayer++;
            }
            for (var i = 0; i < aspectRatios.length; ++i) {
                var ratioSqrts = Math.sqrt(aspectRatios[i]);
                anchorHeight.push(scales[i] / ratioSqrts);
                anchorWidth.push(scales[i] * ratioSqrts);
            }
            var featureMapHeight = 0;
            var featureMapWidth = 0;
            if (config.featureMapHeight.length > 0) {
                featureMapHeight = config.featureMapHeight[layerId];
                featureMapWidth = config.featureMapWidth[layerId];
            }
            else {
                var stride = config.strides[layerId];
                featureMapHeight = Math.ceil(config.inputSizeHeight / stride);
                featureMapWidth = Math.ceil(config.inputSizeWidth / stride);
            }
            for (var y = 0; y < featureMapHeight; ++y) {
                for (var x = 0; x < featureMapWidth; ++x) {
                    for (var anchorId = 0; anchorId < anchorHeight.length; ++anchorId) {
                        var xCenter = (x + config.anchorOffsetX) / featureMapWidth;
                        var yCenter = (y + config.anchorOffsetY) / featureMapHeight;
                        var newAnchor = { xCenter: xCenter, yCenter: yCenter, width: 0, height: 0 };
                        if (config.fixedAnchorSize) {
                            newAnchor.width = 1.0;
                            newAnchor.height = 1.0;
                        }
                        else {
                            newAnchor.width = anchorWidth[anchorId];
                            newAnchor.height = anchorHeight[anchorId];
                        }
                        anchors.push(newAnchor);
                    }
                }
            }
            layerId = lastSameStrideLayer;
        }
        return anchors;
    }
    function calculateScale(minScale, maxScale, strideIndex, numStrides) {
        if (numStrides === 1) {
            return (minScale + maxScale) * 0.5;
        }
        else {
            return minScale + (maxScale - minScale) * strideIndex / (numStrides - 1);
        }
    }

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
    function splitDetectionResult(detectionResult) {
        return tf.tidy(function () {
            // logit is stored in the first element in each anchor data.
            var logits = tf.slice(detectionResult, [0, 0, 0], [1, -1, 1]);
            // Bounding box coords are stored in the next four elements for each anchor
            // point.
            var rawBoxes = tf.slice(detectionResult, [0, 0, 1], [1, -1, -1]);
            return [logits, rawBoxes];
        });
    }

    function detectorInference(imageTensor, poseDetectorModel) {
        return tf.tidy(function () {
            var detectionResult = poseDetectorModel.predict(imageTensor);
            var _a = splitDetectionResult(detectionResult), logits = _a[0], rawBoxes = _a[1];
            // Shape [896, 12]
            var rawBoxes2d = tf.squeeze(rawBoxes);
            // Shape [896]
            var logits1d = tf.squeeze(logits);
            return { boxes: rawBoxes2d, logits: logits1d };
        });
    }

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
    function isVideo(image) {
        return (image != null) && image.currentTime != null;
    }

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
     * Converts normalized Landmark to `Detection`. A relative bounding box will
     * be created containing all landmarks exactly.
     * @param landmarks List of normalized landmarks.
     *
     * @returns A `Detection`.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmarks_to_detection_calculator.cc
    function landmarksToDetection(landmarks) {
        var detection = { locationData: { relativeKeypoints: [] } };
        var xMin = Number.MAX_SAFE_INTEGER;
        var xMax = Number.MIN_SAFE_INTEGER;
        var yMin = Number.MAX_SAFE_INTEGER;
        var yMax = Number.MIN_SAFE_INTEGER;
        for (var i = 0; i < landmarks.length; ++i) {
            var landmark = landmarks[i];
            xMin = Math.min(xMin, landmark.x);
            xMax = Math.max(xMax, landmark.x);
            yMin = Math.min(yMin, landmark.y);
            yMax = Math.max(yMax, landmark.y);
            detection.locationData.relativeKeypoints.push({ x: landmark.x, y: landmark.y });
        }
        detection.locationData.relativeBoundingBox =
            { xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax, width: (xMax - xMin), height: (yMax - yMin) };
        return detection;
    }

    function nonMaxSuppression(detections, maxDetections, iouThreshold, 
    // Currently only IOU overap is supported.
    overlapType) {
        return __awaiter(this, void 0, void 0, function () {
            var detectionsTensor, scoresTensor, selectedIdsTensor, selectedIds, selectedDetections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Sort to match NonMaxSuppresion calculator's decreasing detection score
                        // traversal.
                        // NonMaxSuppresionCalculator: RetainMaxScoringLabelOnly
                        detections.sort(function (detectionA, detectionB) {
                            return Math.max.apply(Math, detectionB.score) - Math.max.apply(Math, detectionA.score);
                        });
                        detectionsTensor = tf.tensor2d(detections.map(function (d) {
                            return [d.locationData.relativeBoundingBox.yMin,
                                d.locationData.relativeBoundingBox.xMin,
                                d.locationData.relativeBoundingBox.yMax,
                                d.locationData.relativeBoundingBox.xMax];
                        }));
                        scoresTensor = tf.tensor1d(detections.map(function (d) { return d.score[0]; }));
                        return [4 /*yield*/, tf.image.nonMaxSuppressionAsync(detectionsTensor, scoresTensor, maxDetections, iouThreshold)];
                    case 1:
                        selectedIdsTensor = _a.sent();
                        return [4 /*yield*/, selectedIdsTensor.array()];
                    case 2:
                        selectedIds = _a.sent();
                        selectedDetections = detections.filter(function (_, i) { return (selectedIds.indexOf(i) > -1); });
                        tf.dispose([detectionsTensor, scoresTensor, selectedIdsTensor]);
                        return [2 /*return*/, selectedDetections];
                }
            });
        });
    }

    function normalizedKeypointsToKeypoints(normalizedKeypoints, imageSize) {
        return normalizedKeypoints.map(function (normalizedKeypoint) {
            var keypoint = __assign(__assign({}, normalizedKeypoint), { x: normalizedKeypoint.x * imageSize.width, y: normalizedKeypoint.y * imageSize.height });
            if (normalizedKeypoint.z != null) {
                // Scale z the same way as x (using image width).
                keypoint.z = normalizedKeypoint.z * imageSize.width;
            }
            return keypoint;
        });
    }

    /**
     * A calculator that refines landmarks using corresponding heatmap area.
     *
     * High level algorithm
     * For each landmark, we replace original value with a value calculated from the
     * area in heatmap close to original landmark position (the area is defined by
     * config.kernelSize). To calculate new coordinate from heatmap we calculate an
     * weighted average inside the kernel. We update the landmark if heatmap is
     * confident in it's prediction i.e. max(heatmap) in kernel is at least bigger
     * than config.minConfidenceToRefine.
     * @param landmarks List of lardmarks to refine.
     * @param heatmapTensor The heatmap for the landmarks with shape
     *     [height, width, channel]. The channel dimension has to be the same as
     *     the number of landmarks.
     * @param config The config for refineLandmarksFromHeap,
     *     see `RefineLandmarksFromHeatmapConfig` for detail.
     *
     * @returns Normalized landmarks.
     */
    function refineLandmarksFromHeatmap(landmarks, heatmapTensor, config) {
        return __awaiter(this, void 0, void 0, function () {
            var $heatmapTensor, _a, hmHeight, hmWidth, hmChannels, outLandmarks, heatmapBuf, i, landmark, outLandmark, centerCol, centerRow, offset, beginCol, endCol, beginRow, endRow, sum, weightedCol, weightedRow, maxValue, row, col, confidence;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        $heatmapTensor = tf.squeeze(heatmapTensor, [0]);
                        _a = $heatmapTensor.shape, hmHeight = _a[0], hmWidth = _a[1], hmChannels = _a[2];
                        if (landmarks.length !== hmChannels) {
                            throw new Error('Expected heatmap to have same number of channels ' +
                                'as the number of landmarks. But got landmarks length: ' +
                                (landmarks.length + ", heatmap length: " + hmChannels));
                        }
                        outLandmarks = [];
                        return [4 /*yield*/, $heatmapTensor.buffer()];
                    case 1:
                        heatmapBuf = _b.sent();
                        for (i = 0; i < landmarks.length; i++) {
                            landmark = landmarks[i];
                            outLandmark = __assign({}, landmark);
                            outLandmarks.push(outLandmark);
                            centerCol = Math.trunc(outLandmark.x * hmWidth);
                            centerRow = Math.trunc(outLandmark.y * hmHeight);
                            // Point is outside of the image let's keep it intact.
                            if (centerCol < 0 || centerCol >= hmWidth || centerRow < 0 ||
                                centerCol >= hmHeight) {
                                continue;
                            }
                            offset = Math.trunc((config.kernelSize - 1) / 2);
                            beginCol = Math.max(0, centerCol - offset);
                            endCol = Math.min(hmWidth, centerCol + offset + 1);
                            beginRow = Math.max(0, centerRow - offset);
                            endRow = Math.min(hmHeight, centerRow + offset + 1);
                            sum = 0;
                            weightedCol = 0;
                            weightedRow = 0;
                            maxValue = 0;
                            // Main loop. Go over kernel and calculate weighted sum of coordinates,
                            // sum of weights and max weights.
                            for (row = beginRow; row < endRow; ++row) {
                                for (col = beginCol; col < endCol; ++col) {
                                    confidence = heatmapBuf.get(row, col, i);
                                    sum += confidence;
                                    maxValue = Math.max(maxValue, confidence);
                                    weightedCol += col * confidence;
                                    weightedRow += row * confidence;
                                }
                            }
                            if (maxValue >= config.minConfidenceToRefine && sum > 0) {
                                outLandmark.x = weightedCol / hmWidth / sum;
                                outLandmark.y = weightedRow / hmHeight / sum;
                            }
                        }
                        $heatmapTensor.dispose();
                        return [2 /*return*/, outLandmarks];
                }
            });
        });
    }

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
     * Adjusts detection locations on the letterboxed image to the corresponding
     * locations on the same image with the letterbox removed (the input image to
     * the graph before image transformation).
     *
     * @param detections A list of detection boxes on an letterboxed image.
     * @param letterboxPadding A `padding` object representing the letterbox padding
     *     from the 4 sides: left, top, right, bottom, of the letterboxed image,
     *     normalized by the letterboxed image dimensions.
     * @returns detections: A list of detection boxes representing detections with
     *     their locations adjusted to the letterbox-removed (non-padded) image.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/detection_letterbox_removal_calculator.cc
    function removeDetectionLetterbox(detections, letterboxPadding) {
        if (detections === void 0) { detections = []; }
        var left = letterboxPadding.left;
        var top = letterboxPadding.top;
        var leftAndRight = letterboxPadding.left + letterboxPadding.right;
        var topAndBottom = letterboxPadding.top + letterboxPadding.bottom;
        for (var i = 0; i < detections.length; i++) {
            var detection = detections[i];
            var relativeBoundingBox = detection.locationData.relativeBoundingBox;
            var xMin = (relativeBoundingBox.xMin - left) / (1 - leftAndRight);
            var yMin = (relativeBoundingBox.yMin - top) / (1 - topAndBottom);
            var width = relativeBoundingBox.width / (1 - leftAndRight);
            var height = relativeBoundingBox.height / (1 - topAndBottom);
            relativeBoundingBox.xMin = xMin;
            relativeBoundingBox.yMin = yMin;
            relativeBoundingBox.width = width;
            relativeBoundingBox.height = height;
            relativeBoundingBox.xMax = xMin + width;
            relativeBoundingBox.yMax = yMin + height;
            var relativeKeypoints = detection.locationData.relativeKeypoints;
            if (relativeKeypoints) {
                relativeKeypoints.forEach(function (keypoint) {
                    var newX = (keypoint.x - left) / (1 - leftAndRight);
                    var newY = (keypoint.y - top) / (1 - topAndBottom);
                    keypoint.x = newX;
                    keypoint.y = newY;
                });
            }
        }
        return detections;
    }

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
     * Adjusts landmark locations on a letterboxed image to the corresponding
     * locations on the same image with the letterbox removed.
     * @param rawLandmark A NormalizedLandmarkList representing landmarks on an
     * letterboxed image.
     * @param padding A `padding` representing the letterbox padding from the 4
     *     sides, left, top, right, bottom, of the letterboxed image, normalized by
     *     the letterboxed image dimensions.
     * @returns Normalized landmarks.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmark_letterbox_removal_calculator.cc
    function removeLandmarkLetterbox(rawLandmark, padding) {
        var left = padding.left;
        var top = padding.top;
        var leftAndRight = padding.left + padding.right;
        var topAndBottom = padding.top + padding.bottom;
        var outLandmarks = rawLandmark.map(function (landmark) {
            return __assign(__assign({}, landmark), { x: (landmark.x - left) / (1 - leftAndRight), y: (landmark.y - top) / (1 - topAndBottom), z: landmark.z / (1 - leftAndRight) // Scale Z coordinate as X.
             });
        });
        return outLandmarks;
    }

    /**
     * A calculator for mixing two segmentation masks together, based on an
     * uncertantity probability estimate.
     * @param prevMaks Segmentation mask from previous image.
     * @param newMask Segmentation mask of current image.
     * @param config Contains ratio of amount of previous mask to blend with
     *     current.
     *
     * @returns Image mask.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/image/segmentation_smoothing_calculator.cc
    function smoothSegmentation(prevMask, newMask, config) {
        if (tf.getBackend() === 'webgl') {
            // Same as implementation in the else case but reduces number of shader
            // calls to 1 instead of 17.
            return smoothSegmentationWebGL(prevMask, newMask, config);
        }
        return tf.tidy(function () {
            /*
             * Assume p := newMaskValue
             * H(p) := 1 + (p * log(p) + (1-p) * log(1-p)) / log(2)
             * uncertainty alpha(p) =
             *   Clamp(1 - (1 - H(p)) * (1 - H(p)), 0, 1) [squaring the
             * uncertainty]
             *
             * The following polynomial approximates uncertainty alpha as a
             * function of (p + 0.5):
             */
            var c1 = 5.68842;
            var c2 = -0.748699;
            var c3 = -57.8051;
            var c4 = 291.309;
            var c5 = -624.717;
            var t = tf.sub(newMask, 0.5);
            var x = tf.square(t);
            // Per element calculation is: 1.0 - Math.min(1.0, x * (c1 + x * (c2 + x
            // * (c3 + x * (c4 + x * c5))))).
            var uncertainty = tf.sub(1, tf.minimum(1, tf.mul(x, tf.add(c1, tf.mul(x, tf.add(c2, tf.mul(x, tf.add(c3, tf.mul(x, tf.add(c4, tf.mul(x, c5)))))))))));
            // Per element calculation is: newMaskValue + (prevMaskValue -
            // newMaskValue) * (uncertainty * combineWithPreviousRatio).
            return tf.add(newMask, tf.mul(tf.sub(prevMask, newMask), tf.mul(uncertainty, config.combineWithPreviousRatio)));
        });
    }
    function smoothSegmentationWebGL(prevMask, newMask, config) {
        var ratio = config.combineWithPreviousRatio.toFixed(2);
        var program = {
            variableNames: ['prevMask', 'newMask'],
            outputShape: prevMask.shape,
            userCode: "\n  void main() {\n      ivec2 coords = getOutputCoords();\n      int height = coords[0];\n      int width = coords[1];\n\n      float prevMaskValue = getPrevMask(height, width);\n      float newMaskValue = getNewMask(height, width);\n\n      /*\n      * Assume p := newMaskValue\n      * H(p) := 1 + (p * log(p) + (1-p) * log(1-p)) / log(2)\n      * uncertainty alpha(p) =\n      *   Clamp(1 - (1 - H(p)) * (1 - H(p)), 0, 1) [squaring the\n      * uncertainty]\n      *\n      * The following polynomial approximates uncertainty alpha as a\n      * function of (p + 0.5):\n      */\n      const float c1 = 5.68842;\n      const float c2 = -0.748699;\n      const float c3 = -57.8051;\n      const float c4 = 291.309;\n      const float c5 = -624.717;\n      float t = newMaskValue - 0.5;\n      float x = t * t;\n\n      float uncertainty =\n        1.0 - min(1.0, x * (c1 + x * (c2 + x * (c3 + x * (c4 + x * c5)))));\n\n      float outputValue = newMaskValue + (prevMaskValue - newMaskValue) *\n                             (uncertainty * " + ratio + ");\n\n      setOutput(outputValue);\n    }\n"
        };
        var webglBackend = tf.backend();
        return tf.tidy(function () {
            var outputTensorInfo = webglBackend.compileAndRun(program, [prevMask, newMask]);
            return tf.engine().makeTensorFromDataId(outputTensorInfo.dataId, outputTensorInfo.shape, outputTensorInfo.dtype);
        });
    }

    /**
     * Convert result Tensors from object detection models into Detection boxes.
     *
     * @param detectionTensors List of Tensors of type Float32. The list of tensors
     *     can have 2 or 3 tensors. First tensor is the predicted raw
     *     boxes/keypoints. The size of the values must be
     *     (num_boxes * num_predicted_values). Second tensor is the score tensor.
     *     The size of the valuse must be (num_boxes * num_classes). It's optional
     *     to pass in a third tensor for anchors (e.g. for SSD models) depend on the
     *     outputs of the detection model. The size of anchor tensor must be
     *     (num_boxes * 4).
     * @param anchor A tensor for anchors. The size of anchor tensor must be
     *     (num_boxes * 4).
     * @param config
     */
    function tensorsToDetections(detectionTensors, anchor, config) {
        return __awaiter(this, void 0, void 0, function () {
            var rawScoreTensor, rawBoxTensor, boxes, normalizedScore, outputDetections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawScoreTensor = detectionTensors[0];
                        rawBoxTensor = detectionTensors[1];
                        boxes = decodeBoxes(rawBoxTensor, anchor, config);
                        normalizedScore = tf.tidy(function () {
                            var normalizedScore = rawScoreTensor;
                            if (config.sigmoidScore) {
                                if (config.scoreClippingThresh != null) {
                                    normalizedScore = tf.clipByValue(rawScoreTensor, -config.scoreClippingThresh, config.scoreClippingThresh);
                                }
                                normalizedScore = tf.sigmoid(normalizedScore);
                                return normalizedScore;
                            }
                            return normalizedScore;
                        });
                        return [4 /*yield*/, convertToDetections(boxes, normalizedScore, config)];
                    case 1:
                        outputDetections = _a.sent();
                        tf.dispose([boxes, normalizedScore]);
                        return [2 /*return*/, outputDetections];
                }
            });
        });
    }
    function convertToDetections(detectionBoxes, detectionScore, config) {
        return __awaiter(this, void 0, void 0, function () {
            var outputDetections, detectionBoxesData, detectionScoresData, i, boxOffset, detection, bbox, locationData, totalIdx, kpId, keypointIndex, keypoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outputDetections = [];
                        return [4 /*yield*/, detectionBoxes.data()];
                    case 1:
                        detectionBoxesData = _a.sent();
                        return [4 /*yield*/, detectionScore.data()];
                    case 2:
                        detectionScoresData = _a.sent();
                        for (i = 0; i < config.numBoxes; ++i) {
                            if (config.minScoreThresh != null &&
                                detectionScoresData[i] < config.minScoreThresh) {
                                continue;
                            }
                            boxOffset = i * config.numCoords;
                            detection = convertToDetection(detectionBoxesData[boxOffset + 0] /* boxYMin */, detectionBoxesData[boxOffset + 1] /* boxXMin */, detectionBoxesData[boxOffset + 2] /* boxYMax */, detectionBoxesData[boxOffset + 3] /* boxXMax */, detectionScoresData[i], config.flipVertically, i);
                            bbox = detection.locationData.relativeBoundingBox;
                            if (bbox.width < 0 || bbox.height < 0) {
                                // Decoded detection boxes could have negative values for width/height
                                // due to model prediction. Filter out those boxes since some
                                // downstream calculators may assume non-negative values.
                                continue;
                            }
                            // Add keypoints.
                            if (config.numKeypoints > 0) {
                                locationData = detection.locationData;
                                locationData.relativeKeypoints = [];
                                totalIdx = config.numKeypoints * config.numValuesPerKeypoint;
                                for (kpId = 0; kpId < totalIdx; kpId += config.numValuesPerKeypoint) {
                                    keypointIndex = boxOffset + config.keypointCoordOffset + kpId;
                                    keypoint = {
                                        x: detectionBoxesData[keypointIndex + 0],
                                        y: config.flipVertically ? 1 - detectionBoxesData[keypointIndex + 1] :
                                            detectionBoxesData[keypointIndex + 1]
                                    };
                                    locationData.relativeKeypoints.push(keypoint);
                                }
                            }
                            outputDetections.push(detection);
                        }
                        return [2 /*return*/, outputDetections];
                }
            });
        });
    }
    function convertToDetection(boxYMin, boxXMin, boxYMax, boxXMax, score, flipVertically, i) {
        return {
            score: [score],
            ind: i,
            locationData: {
                relativeBoundingBox: {
                    xMin: boxXMin,
                    yMin: flipVertically ? 1 - boxYMax : boxYMin,
                    xMax: boxXMax,
                    yMax: flipVertically ? 1 - boxYMin : boxYMax,
                    width: boxXMax - boxXMin,
                    height: boxYMax - boxYMin
                }
            }
        };
    }
    //[xCenter, yCenter, w, h, kp1, kp2, kp3, kp4]
    //[yMin, xMin, yMax, xMax, kpX, kpY, kpX, kpY]
    function decodeBoxes(rawBoxes, anchor, config) {
        return tf.tidy(function () {
            var yCenter;
            var xCenter;
            var h;
            var w;
            if (config.reverseOutputOrder) {
                // Shape [numOfBoxes, 1].
                xCenter = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 0], [-1, 1]));
                yCenter = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 1], [-1, 1]));
                w = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 2], [-1, 1]));
                h = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 3], [-1, 1]));
            }
            else {
                yCenter = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 0], [-1, 1]));
                xCenter = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 1], [-1, 1]));
                h = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 2], [-1, 1]));
                w = tf.squeeze(tf.slice(rawBoxes, [0, config.boxCoordOffset + 3], [-1, 1]));
            }
            xCenter =
                tf.add(tf.mul(tf.div(xCenter, config.xScale), anchor.w), anchor.x);
            yCenter =
                tf.add(tf.mul(tf.div(yCenter, config.yScale), anchor.h), anchor.y);
            if (config.applyExponentialOnBoxSize) {
                h = tf.mul(tf.exp(tf.div(h, config.hScale)), anchor.h);
                w = tf.mul(tf.exp(tf.div(w, config.wScale)), anchor.w);
            }
            else {
                h = tf.mul(tf.div(h, config.hScale), anchor.h);
                w = tf.mul(tf.div(w, config.wScale), anchor.h);
            }
            var yMin = tf.sub(yCenter, tf.div(h, 2));
            var xMin = tf.sub(xCenter, tf.div(w, 2));
            var yMax = tf.add(yCenter, tf.div(h, 2));
            var xMax = tf.add(xCenter, tf.div(w, 2));
            // Shape [numOfBoxes, 4].
            var boxes = tf.concat([
                tf.reshape(yMin, [config.numBoxes, 1]),
                tf.reshape(xMin, [config.numBoxes, 1]),
                tf.reshape(yMax, [config.numBoxes, 1]),
                tf.reshape(xMax, [config.numBoxes, 1])
            ], 1);
            if (config.numKeypoints) {
                for (var k = 0; k < config.numKeypoints; ++k) {
                    var keypointOffset = config.keypointCoordOffset + k * config.numValuesPerKeypoint;
                    var keypointX = void 0;
                    var keypointY = void 0;
                    if (config.reverseOutputOrder) {
                        keypointX =
                            tf.squeeze(tf.slice(rawBoxes, [0, keypointOffset], [-1, 1]));
                        keypointY =
                            tf.squeeze(tf.slice(rawBoxes, [0, keypointOffset + 1], [-1, 1]));
                    }
                    else {
                        keypointY =
                            tf.squeeze(tf.slice(rawBoxes, [0, keypointOffset], [-1, 1]));
                        keypointX =
                            tf.squeeze(tf.slice(rawBoxes, [0, keypointOffset + 1], [-1, 1]));
                    }
                    var keypointXNormalized = tf.add(tf.mul(tf.div(keypointX, config.xScale), anchor.w), anchor.x);
                    var keypointYNormalized = tf.add(tf.mul(tf.div(keypointY, config.yScale), anchor.h), anchor.y);
                    boxes = tf.concat([
                        boxes, tf.reshape(keypointXNormalized, [config.numBoxes, 1]),
                        tf.reshape(keypointYNormalized, [config.numBoxes, 1])
                    ], 1);
                }
            }
            // Shape [numOfBoxes, 4] || [numOfBoxes, 12].
            return boxes;
        });
    }

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
    function sigmoid(value) {
        return 1 / (1 + Math.exp(-value));
    }

    function applyActivation(activation, value) {
        return activation === 'none' ? value : sigmoid(value);
    }
    /**
     * A calculator for converting Tensors from regression models into landmarks.
     * Note that if the landmarks in the tensor has more than 5 dimensions, only the
     * first 5 dimensions will be converted to [x,y,z, visibility, presence]. The
     * latter two fields may also stay unset if such attributes are not supported in
     * the model.
     * @param landmarkTensor List of Tensors of type float32. Only the first tensor
     * will be used. The size of the values must be (num_dimension x num_landmarks).
     * @param flipHorizontally Optional. Whether to flip landmarks horizontally or
     * not. Overrides corresponding field in config.
     * @param flipVertically Optional. Whether to flip landmarks vertically or not.
     * Overrides corresponding field in config.
     *
     * @param config
     *
     * @returns Normalized landmarks.
     */
    function tensorsToLandmarks(landmarkTensor, config, flipHorizontally, flipVertically) {
        return __awaiter(this, void 0, void 0, function () {
            var numValues, numDimensions, rawLandmarks, outputLandmarks, ld, offset, landmark, i, landmark;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flipHorizontally = flipHorizontally || config.flipHorizontally || false;
                        flipVertically = flipVertically || config.flipVertically || false;
                        numValues = landmarkTensor.size;
                        numDimensions = numValues / config.numLandmarks;
                        return [4 /*yield*/, landmarkTensor.data()];
                    case 1:
                        rawLandmarks = _a.sent();
                        outputLandmarks = [];
                        for (ld = 0; ld < config.numLandmarks; ++ld) {
                            offset = ld * numDimensions;
                            landmark = { x: 0, y: 0 };
                            if (flipHorizontally) {
                                landmark.x = config.inputImageWidth - rawLandmarks[offset];
                            }
                            else {
                                landmark.x = rawLandmarks[offset];
                            }
                            if (numDimensions > 1) {
                                if (flipVertically) {
                                    landmark.y = config.inputImageHeight - rawLandmarks[offset + 1];
                                }
                                else {
                                    landmark.y = rawLandmarks[offset + 1];
                                }
                            }
                            if (numDimensions > 2) {
                                landmark.z = rawLandmarks[offset + 2];
                            }
                            if (numDimensions > 3) {
                                landmark.score = applyActivation(config.visibilityActivation, rawLandmarks[offset + 3]);
                            }
                            // presence is in rawLandmarks[offset + 4], we don't expose it.
                            outputLandmarks.push(landmark);
                        }
                        for (i = 0; i < outputLandmarks.length; ++i) {
                            landmark = outputLandmarks[i];
                            landmark.x = landmark.x / config.inputImageWidth;
                            landmark.y = landmark.y / config.inputImageHeight;
                            // Scale Z coordinate as X + allow additional uniform normalization.
                            landmark.z = landmark.z / config.inputImageWidth / (config.normalizeZ || 1);
                        }
                        return [2 /*return*/, outputLandmarks];
                }
            });
        });
    }

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
     * Converts a tensor from a segmentation model to an image mask.
     * @param segmentationTensor Output from segmentation model of shape (1, height,
     *     width, channels).
     * @param config Contains activation to apply.
     * @param outputSize Desired dimensions of output image mask.
     *
     * @returns Image mask.
     */
    function tensorsToSegmentation(segmentationTensor, config, outputSize) {
        return tf.tidy(function () {
            // Remove batch dimension.
            var $segmentationTensor = 
            // tslint:disable-next-line: no-unnecessary-type-assertion
            tf.squeeze(segmentationTensor, [0]);
            var tensorChannels = $segmentationTensor.shape[2];
            // Process mask tensor and apply activation function.
            if (tensorChannels === 1) {
                // Create initial working mask.
                var smallMaskMat = $segmentationTensor;
                switch (config.activation) {
                    case 'none':
                        break;
                    case 'sigmoid':
                        smallMaskMat = tf.sigmoid(smallMaskMat);
                        break;
                    case 'softmax':
                        throw new Error('Softmax activation requires two channels.');
                    default:
                        throw new Error("Activation not supported (" + config.activation + ")");
                }
                var outputMat = outputSize ?
                    tf.image.resizeBilinear(smallMaskMat, [outputSize.height, outputSize.width]) :
                    smallMaskMat;
                // Remove channel dimension.
                return tf.squeeze(outputMat, [2]);
            }
            else {
                throw new Error("Unsupported number of tensor channels " + tensorChannels);
            }
        });
    }

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
     * Performs geometric transformation to the input normalized rectangle,
     * correpsonding to input normalized rectangle respectively.
     * @param rect The normalized rectangle.
     * @param imageSize The original imageSize.
     * @param config See documentation in `RectTransformationConfig`.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/rect_transformation_calculator.cc
    function transformNormalizedRect(rect, imageSize, config) {
        var width = rect.width;
        var height = rect.height;
        var rotation = rect.rotation;
        if (config.rotation != null || config.rotationDegree != null) {
            rotation = computeNewRotation(rotation, config);
        }
        if (rotation === 0) {
            rect.xCenter = rect.xCenter + width * config.shiftX;
            rect.yCenter = rect.yCenter + height * config.shiftY;
        }
        else {
            var xShift = (imageSize.width * width * config.shiftX * Math.cos(rotation) -
                imageSize.height * height * config.shiftY * Math.sin(rotation)) /
                imageSize.width;
            var yShift = (imageSize.width * width * config.shiftX * Math.sin(rotation) +
                imageSize.height * height * config.shiftY * Math.cos(rotation)) /
                imageSize.height;
            rect.xCenter = rect.xCenter + xShift;
            rect.yCenter = rect.yCenter + yShift;
        }
        if (config.squareLong) {
            var longSide = Math.max(width * imageSize.width, height * imageSize.height);
            width = longSide / imageSize.width;
            height = longSide / imageSize.height;
        }
        else if (config.squareShort) {
            var shortSide = Math.min(width * imageSize.width, height * imageSize.height);
            width = shortSide / imageSize.width;
            height = shortSide / imageSize.height;
        }
        rect.width = width * config.scaleX;
        rect.height = height * config.scaleY;
        return rect;
    }
    function computeNewRotation(rotation, config) {
        if (config.rotation != null) {
            rotation += config.rotation;
        }
        else if (config.rotationDegree != null) {
            rotation += Math.PI * config.rotationDegree / 180;
        }
        return normalizeRadians(rotation);
    }

    /**
     * Estimate object scale to allow filter work similarly on nearer or futher
     * objects.
     * @param roi Normalized rectangle.
     * @param imageSize An object that contains width and height.
     * @returns A number representing the object scale.
     */
    function getObjectScale(roi, imageSize) {
        var objectWidth = roi.width * imageSize.width;
        var objectHeight = roi.height * imageSize.height;
        return (objectWidth + objectHeight) / 2;
    }

    function keypointsToNormalizedKeypoints(keypoints, imageSize) {
        return keypoints.map(function (keypoint) {
            var normalizedKeypoint = __assign(__assign({}, keypoint), { x: keypoint.x / imageSize.width, y: keypoint.y / imageSize.height });
            if (keypoint.z != null) {
                // Scale z the same way as x (using image width).
                keypoint.z = keypoint.z / imageSize.width;
            }
            return normalizedKeypoint;
        });
    }

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
     * OneEuroFilter.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/util/filtering/one_euro_filter.cc
    // Also ref original paper:
    // https://cristal.univ-lille.fr/~casiez/1euro/
    var OneEuroFilter = /** @class */ (function () {
        /**
         * Constructor of `OneEuroFilter` class.
         * @param config See documentation of `OneEuroFilterConfig`.
         */
        function OneEuroFilter(config) {
            this.frequency = config.frequency;
            this.minCutOff = config.minCutOff;
            this.beta = config.beta;
            this.thresholdCutOff = config.thresholdCutOff;
            this.thresholdBeta = config.thresholdBeta;
            this.derivateCutOff = config.derivateCutOff;
            this.x = new LowPassFilter(this.getAlpha(this.minCutOff));
            this.dx = new LowPassFilter(this.getAlpha(this.derivateCutOff));
            this.lastTimestamp = 0;
        }
        /**
         * Applies filter to the value.
         * @param value valueToFilter.
         * @param microSeconds timestamp associated with the value (for instance,
         *     timestamp of the frame where you got value from).
         */
        OneEuroFilter.prototype.apply = function (value, microSeconds, valueScale) {
            if (value == null) {
                return value;
            }
            var $microSeconds = Math.trunc(microSeconds);
            if (this.lastTimestamp >= $microSeconds) {
                // Results are unpreditable in this case, so nothing to do but return
                // same value.
                return value;
            }
            // Update the sampling frequency based on timestamps.
            if (this.lastTimestamp !== 0 && $microSeconds !== 0) {
                this.frequency =
                    1 / (($microSeconds - this.lastTimestamp) * MICRO_SECONDS_TO_SECOND);
            }
            this.lastTimestamp = $microSeconds;
            // Estimate the current variation per second.
            var dValue = this.x.hasLastRawValue() ?
                (value - this.x.lastRawValue()) * valueScale * this.frequency :
                0;
            var edValue = this.dx.applyWithAlpha(dValue, this.getAlpha(this.derivateCutOff));
            var cutOff = this.minCutOff + this.beta * Math.abs(edValue);
            var threshold = this.thresholdCutOff != null ?
                this.thresholdCutOff + this.thresholdBeta * Math.abs(edValue) :
                null;
            // filter the given value.
            return this.x.applyWithAlpha(value, this.getAlpha(cutOff), threshold);
        };
        OneEuroFilter.prototype.getAlpha = function (cutoff) {
            // te = 1.0 / this.frequency
            // tau = 1.0 / (2 * Math.PI * cutoff)
            // result = 1 / (1.0 + (tau / te))
            return 1.0 / (1.0 + (this.frequency / (2 * Math.PI * cutoff)));
        };
        return OneEuroFilter;
    }());

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
                this.xFilters = keypoints.map(function (_) { return new OneEuroFilter(_this.config); });
                this.yFilters = keypoints.map(function (_) { return new OneEuroFilter(_this.config); });
                this.zFilters = keypoints.map(function (_) { return new OneEuroFilter(_this.config); });
            }
        };
        return KeypointsOneEuroFilter;
    }());

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
     * This filter keeps track (on a window of specified size) of value changes
     * over time, which as result gives us velocity of how value changes over time.
     * With higher velocity it weights new values higher.
     *
     * Use `windowSize` and `velocityScale` to tweak this filter for your use case.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/util/filtering/relative_velocity_filter.cc
    var RelativeVelocityFilter = /** @class */ (function () {
        /**
         * Constructor of `RelativeVelocityFilter` class.
         * @param config
         *        `windowSize`:  Higher windowSize adds to lag and to stability.
         *        `velocityScale`: Lower velocityScale adds to lag and to stability.
         */
        function RelativeVelocityFilter(config) {
            this.config = config;
            this.window = [];
            this.lowPassFilter = new LowPassFilter(1.0);
            this.lastValue = 0;
            this.lastValueScale = 1;
            this.lastTimestamp = -1;
        }
        /**
         * Applies filter to the value.
         * @param value valueToFilter.
         * @param microSeconds timestamp associated with the value (for instance,
         *     timestamp of the frame where you got value from).
         * @param valueScale value scale (for instance, if your value is a distance
         *     detected on a frame, it can look same on different devices but have
         *     quite different absolute values due to different resolution, you
         *     should come up with an appropriate parameter for your particular use
         *     case).
         */
        RelativeVelocityFilter.prototype.apply = function (value, microSeconds, valueScale) {
            if (value == null) {
                return value;
            }
            var $microSeconds = Math.trunc(microSeconds);
            if (this.lastTimestamp >= $microSeconds) {
                // Results are unpreditable in this case, so nothing to do but return
                // same value.
                return value;
            }
            var alpha;
            if (this.lastTimestamp === -1) {
                alpha = 1;
            }
            else {
                // Implement the DistanceEstimationMode.kLegacyTransition.
                // TODO(lina128): Change to kForceCurrentScale or at least add an option
                // that can be tweaked with parameter.
                var distance = value * valueScale - this.lastValue * this.lastValueScale;
                var duration = $microSeconds - this.lastTimestamp;
                var cumulativeDistance = distance;
                var cumulativeDuration = duration;
                // Define max cumulative duration assuming 30 frames per second is a good
                // frame rate, so assuming 30 values per second or 1 / 30 of a second is
                // a good duration per window element.
                var assumedMaxDuration = SECOND_TO_MICRO_SECONDS / 30;
                var maxCumulativeDuration = (1 + this.window.length) * assumedMaxDuration;
                for (var _i = 0, _a = this.window; _i < _a.length; _i++) {
                    var el = _a[_i];
                    if (cumulativeDuration + el.duration > maxCumulativeDuration) {
                        // This helps in cases when durations are large and outdated
                        // window elements have bad impact on filtering results.
                        break;
                    }
                    cumulativeDistance += el.distance;
                    cumulativeDuration += el.duration;
                }
                var velocity = cumulativeDistance / (cumulativeDuration * MICRO_SECONDS_TO_SECOND);
                alpha = 1 - 1 / (1 + this.config.velocityScale * Math.abs(velocity));
                this.window.unshift({ distance: distance, duration: duration });
                if (this.window.length > this.config.windowSize) {
                    this.window.pop();
                }
            }
            this.lastValue = value;
            this.lastValueScale = valueScale;
            this.lastTimestamp = $microSeconds;
            return this.lowPassFilter.applyWithAlpha(value, alpha);
        };
        return RelativeVelocityFilter;
    }());

    /**
     * A stateful filter that smoothes landmark values overtime.
     *
     * More specifically, it uses `RelativeVelocityFilter` to smooth every x, y, z
     * coordinates over time, which as result gives us velocity of how these values
     * change over time. With higher velocity it weights new values higher.
     */
    // ref:
    // https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/landmarks_smoothing_calculator.cc
    var KeypointsVelocityFilter = /** @class */ (function () {
        function KeypointsVelocityFilter(config) {
            this.config = config;
        }
        KeypointsVelocityFilter.prototype.apply = function (keypoints, microSeconds, objectScale) {
            var _this = this;
            if (keypoints == null) {
                this.reset();
                return null;
            }
            // Get value scale as inverse value of the object scale.
            // If value is too small smoothing will be disabled and keypoints will be
            // returned as is.
            var valueScale = 1;
            if (!this.config.disableValueScaling) {
                if (objectScale < this.config.minAllowedObjectScale) {
                    return __spreadArrays(keypoints);
                }
                valueScale = 1 / objectScale;
            }
            // Initialize filters once.
            this.initializeFiltersIfEmpty(keypoints);
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
        KeypointsVelocityFilter.prototype.reset = function () {
            this.xFilters = null;
            this.yFilters = null;
            this.zFilters = null;
        };
        // Initializes filters for the first time or after reset. If initialized the
        // check the size.
        KeypointsVelocityFilter.prototype.initializeFiltersIfEmpty = function (keypoints) {
            var _this = this;
            if (this.xFilters == null || this.xFilters.length !== keypoints.length) {
                this.xFilters =
                    keypoints.map(function (_) { return new RelativeVelocityFilter(_this.config); });
                this.yFilters =
                    keypoints.map(function (_) { return new RelativeVelocityFilter(_this.config); });
                this.zFilters =
                    keypoints.map(function (_) { return new RelativeVelocityFilter(_this.config); });
            }
        };
        return KeypointsVelocityFilter;
    }());

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
     * A Calculator to smooth keypoints over time.
     */
    var KeypointsSmoothingFilter = /** @class */ (function () {
        function KeypointsSmoothingFilter(config) {
            if (config.velocityFilter != null) {
                this.keypointsFilter = new KeypointsVelocityFilter(config.velocityFilter);
            }
            else if (config.oneEuroFilter != null) {
                this.keypointsFilter = new KeypointsOneEuroFilter(config.oneEuroFilter);
            }
            else {
                throw new Error('Either configure velocityFilter or oneEuroFilter, but got ' +
                    (config + "."));
            }
        }
        /**
         * Apply one of the stateful `KeypointsFilter` to keypoints.
         *
         * Currently supports `OneEuroFilter` and `VelocityFilter`.
         * @param keypoints A list of 2D or 3D keypoints, can be normalized or
         *     non-normalized.
         * @param timestamp The timestamp of the video frame.
         * @param imageSize Optional. The imageSize is useful when keypoints are
         *     normalized.
         * @param normalized Optional. Whether the keypoints are normalized. Default
         *     to false.
         * @param objectScaleROI Optional. The auxiliary ROI to calculate object
         *     scale. If not set, objectScale defaults to 1.
         */
        KeypointsSmoothingFilter.prototype.apply = function (keypoints, timestamp, imageSize, normalized, objectScaleROI) {
            if (normalized === void 0) { normalized = false; }
            if (keypoints == null) {
                this.keypointsFilter.reset();
                return null;
            }
            var objectScale = objectScaleROI != null ? getObjectScale(objectScaleROI, imageSize) : 1;
            var scaledKeypoints = normalized ?
                normalizedKeypointsToKeypoints(keypoints, imageSize) :
                keypoints;
            var scaledKeypointsFiltered = this.keypointsFilter.apply(scaledKeypoints, timestamp, objectScale);
            return normalized ?
                keypointsToNormalizedKeypoints(scaledKeypointsFiltered, imageSize) :
                scaledKeypointsFiltered;
        };
        return KeypointsSmoothingFilter;
    }());

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
     * Smoothing visibility using a `LowPassFilter` for each landmark.
     */
    var LowPassVisibilityFilter = /** @class */ (function () {
        function LowPassVisibilityFilter(config) {
            this.alpha = config.alpha;
        }
        LowPassVisibilityFilter.prototype.apply = function (landmarks) {
            var _this = this;
            if (landmarks == null) {
                // Reset filters.
                this.visibilityFilters = null;
                return null;
            }
            if (this.visibilityFilters == null ||
                (this.visibilityFilters.length !== landmarks.length)) {
                // Initialize new filters.
                this.visibilityFilters =
                    landmarks.map(function (_) { return new LowPassFilter(_this.alpha); });
            }
            var outLandmarks = [];
            // Filter visibilities.
            for (var i = 0; i < landmarks.length; ++i) {
                var landmark = landmarks[i];
                var outLandmark = __assign({}, landmark);
                outLandmark.score = this.visibilityFilters[i].apply(landmark.score);
                outLandmarks.push(outLandmark);
            }
            return outLandmarks;
        };
        return LowPassVisibilityFilter;
    }());

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
    var DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL = 'https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1';
    var DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-full/model.json';
    var DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-lite/model.json';
    var DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY = 'https://storage.googleapis.com/tfjs-blazepose/blazepose-segmentation-heavy/model.json';
    var BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION = {
        reduceBoxesInLowestlayer: false,
        interpolatedScaleAspectRatio: 1.0,
        featureMapHeight: [],
        featureMapWidth: [],
        numLayers: 5,
        minScale: 0.1484375,
        maxScale: 0.75,
        inputSizeHeight: 224,
        inputSizeWidth: 224,
        anchorOffsetX: 0.5,
        anchorOffsetY: 0.5,
        strides: [8, 16, 32, 32, 32],
        aspectRatios: [1.0],
        fixedAnchorSize: true
    };
    var DEFAULT_BLAZEPOSE_MODEL_CONFIG$1 = {
        runtime: 'tfjs',
        modelType: 'full',
        enableSmoothing: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        detectorModelUrl: DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
        landmarkModelUrl: DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL
    };
    var DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = {
        maxPoses: 1,
        flipHorizontal: false
    };
    var BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION = {
        applyExponentialOnBoxSize: false,
        flipVertically: false,
        ignoreClasses: [],
        numClasses: 1,
        numBoxes: 2254,
        numCoords: 12,
        boxCoordOffset: 0,
        keypointCoordOffset: 4,
        numKeypoints: 4,
        numValuesPerKeypoint: 2,
        sigmoidScore: true,
        scoreClippingThresh: 100.0,
        reverseOutputOrder: true,
        xScale: 224.0,
        yScale: 224.0,
        hScale: 224.0,
        wScale: 224.0,
        minScoreThresh: 0.5
    };
    var BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION = {
        minSuppressionThreshold: 0.3,
        overlapType: 'intersection-over-union'
    };
    var BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG = {
        shiftX: 0,
        shiftY: 0,
        scaleX: 1.25,
        scaleY: 1.25,
        squareLong: true
    };
    var BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG = {
        outputTensorSize: { width: 224, height: 224 },
        keepAspectRatio: true,
        outputTensorFloatRange: [-1, 1],
        borderMode: 'zero'
    };
    var BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG = {
        outputTensorSize: { width: 256, height: 256 },
        keepAspectRatio: true,
        outputTensorFloatRange: [0, 1],
        borderMode: 'zero'
    };
    var BLAZEPOSE_POSE_PRESENCE_SCORE = 0.5;
    var BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG = {
        numLandmarks: 39,
        inputImageWidth: 256,
        inputImageHeight: 256,
        visibilityActivation: 'sigmoid',
        flipHorizontally: false,
        flipVertically: false
    };
    var BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG = {
        numLandmarks: 39,
        inputImageWidth: 1,
        inputImageHeight: 1,
        visibilityActivation: 'sigmoid',
        flipHorizontally: false,
        flipVertically: false
    };
    var BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG = {
        kernelSize: 7,
        minConfidenceToRefine: 0.5
    };
    var BLAZEPOSE_NUM_KEYPOINTS = 33;
    var BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS = 35;
    var BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG = {
        alpha: 0.1
    };
    var BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: 0.05,
            // filter when landmark is static.
            beta: 80,
            // alpha in landmark EMA filter when landmark is moving fast.
            derivateCutOff: 1.0,
            // landmark velocity EMA filter.,
            minAllowedObjectScale: 1e-6
        }
    };
    // Auxiliary landmarks are smoothed heavier than main landmarks to make ROI
    // crop for pose landmarks prediction very stable when object is not moving but
    // responsive enough in case of sudden movements.
    var BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: 0.01,
            // EMA filter when landmark is static.
            beta: 10.0,
            // ~0.68 alpha in landmark EMA filter when landmark is moving
            // fast.
            derivateCutOff: 1.0,
            // landmark velocity EMA filter.
            minAllowedObjectScale: 1e-6
        }
    };
    var BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: 0.1,
            // filter when landmark is static.
            beta: 40,
            // alpha in landmark EMA filter when landmark is moving fast.
            derivateCutOff: 1.0,
            // landmark velocity EMA filter.
            minAllowedObjectScale: 1e-6,
            disableValueScaling: true // As world landmarks are predicted in real world 3D coordintates
            // in meters (rather than in pixels of input image) prediction
            // scale does not depend on the pose size in the image.
        }
    };
    var BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG = {
        activation: 'none',
    };
    var BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG = {
        combineWithPreviousRatio: 0.7
    };

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
    function validateModelConfig$1(modelConfig) {
        var config = modelConfig == null ?
            __assign({}, DEFAULT_BLAZEPOSE_MODEL_CONFIG$1) : __assign({}, modelConfig);
        if (config.enableSmoothing == null) {
            config.enableSmoothing = DEFAULT_BLAZEPOSE_MODEL_CONFIG$1.enableSmoothing;
        }
        if (config.enableSegmentation == null) {
            config.enableSegmentation =
                DEFAULT_BLAZEPOSE_MODEL_CONFIG$1.enableSegmentation;
        }
        if (config.smoothSegmentation == null) {
            config.smoothSegmentation =
                DEFAULT_BLAZEPOSE_MODEL_CONFIG$1.smoothSegmentation;
        }
        if (config.modelType == null) {
            config.modelType = DEFAULT_BLAZEPOSE_MODEL_CONFIG$1.modelType;
        }
        if (config.detectorModelUrl == null) {
            config.detectorModelUrl = DEFAULT_BLAZEPOSE_MODEL_CONFIG$1.detectorModelUrl;
        }
        if (config.landmarkModelUrl == null) {
            switch (config.modelType) {
                case 'lite':
                    config.landmarkModelUrl = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE;
                    break;
                case 'heavy':
                    config.landmarkModelUrl = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY;
                    break;
                case 'full':
                default:
                    config.landmarkModelUrl = DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL;
                    break;
            }
        }
        return config;
    }
    function validateEstimationConfig(estimationConfig) {
        var config;
        if (estimationConfig == null) {
            config = DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG;
        }
        else {
            config = __assign({}, estimationConfig);
        }
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
        return config;
    }

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
    var BlazePoseTfjsMask = /** @class */ (function () {
        function BlazePoseTfjsMask(mask) {
            this.mask = mask;
        }
        BlazePoseTfjsMask.prototype.toCanvasImageSource = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, toHTMLCanvasElementLossy(this.mask)];
                });
            });
        };
        BlazePoseTfjsMask.prototype.toImageData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, toImageDataLossy(this.mask)];
                });
            });
        };
        BlazePoseTfjsMask.prototype.toTensor = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mask];
                });
            });
        };
        BlazePoseTfjsMask.prototype.getUnderlyingType = function () {
            return 'tensor';
        };
        return BlazePoseTfjsMask;
    }());
    function maskValueToLabel$1(maskValue) {
        assertMaskValue(maskValue);
        return 'person';
    }
    /**
     * BlazePose detector class.
     */
    var BlazePoseTfjsDetector = /** @class */ (function () {
        function BlazePoseTfjsDetector(detectorModel, landmarkModel, enableSmoothing, enableSegmentation, smoothSegmentation, modelType) {
            this.detectorModel = detectorModel;
            this.landmarkModel = landmarkModel;
            this.enableSmoothing = enableSmoothing;
            this.enableSegmentation = enableSegmentation;
            this.smoothSegmentation = smoothSegmentation;
            this.modelType = modelType;
            // Store global states.
            this.regionOfInterest = null;
            this.prevFilteredSegmentationMask = null;
            this.anchors =
                createSsdAnchors(BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);
            var anchorW = tf.tensor1d(this.anchors.map(function (a) { return a.width; }));
            var anchorH = tf.tensor1d(this.anchors.map(function (a) { return a.height; }));
            var anchorX = tf.tensor1d(this.anchors.map(function (a) { return a.xCenter; }));
            var anchorY = tf.tensor1d(this.anchors.map(function (a) { return a.yCenter; }));
            this.anchorTensor = { x: anchorX, y: anchorY, w: anchorW, h: anchorH };
            this.prevFilteredSegmentationMask =
                this.enableSegmentation ? tf.tensor2d([], [0, 0]) : null;
        }
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
         * @param estimationConfig Optional. See `BlazePoseTfjsEstimationConfig`
         *       documentation for detail.
         *
         * @param timestamp Optional. In milliseconds. This is useful when image is
         *     a tensor, which doesn't have timestamp info. Or to override timestamp
         *     in a video.
         *
         * @return An array of `Pose`s.
         */
        // TF.js implementation of the mediapipe pose detection pipeline.
        // ref graph:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_cpu.pbtxt
        BlazePoseTfjsDetector.prototype.estimatePoses = function (image, estimationConfig, timestamp) {
            return __awaiter(this, void 0, void 0, function () {
                var config, imageSize, image3d, poseRect, detections, firstDetection, poseLandmarksByRoiResult, unfilteredPoseLandmarks, unfilteredAuxiliaryLandmarks, poseScore, unfilteredWorldLandmarks, unfilteredSegmentationMask, _a, poseLandmarks, auxiliaryLandmarks, poseWorldLandmarks, poseRectFromLandmarks, filteredSegmentationMask, keypoints, keypoints3D, pose, rgbaMask, segmentation;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            config = validateEstimationConfig(estimationConfig);
                            if (image == null) {
                                this.reset();
                                return [2 /*return*/, []];
                            }
                            this.maxPoses = config.maxPoses;
                            // User provided timestamp will override video's timestamp.
                            if (timestamp != null) {
                                this.timestamp = timestamp * MILLISECOND_TO_MICRO_SECONDS;
                            }
                            else {
                                // For static images, timestamp should be null.
                                this.timestamp =
                                    isVideo(image) ? image.currentTime * SECOND_TO_MICRO_SECONDS : null;
                            }
                            imageSize = getImageSize(image);
                            image3d = tf.tidy(function () { return tf.cast(toImageTensor(image), 'float32'); });
                            poseRect = this.regionOfInterest;
                            if (!(poseRect == null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.detectPose(image3d)];
                        case 1:
                            detections = _b.sent();
                            if (detections.length === 0) {
                                this.reset();
                                image3d.dispose();
                                return [2 /*return*/, []];
                            }
                            firstDetection = detections[0];
                            // Calculates region of interest based on pose detection, so that can be
                            // used to detect landmarks.
                            poseRect = this.poseDetectionToRoi(firstDetection, imageSize);
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.poseLandmarksByRoi(poseRect, image3d)];
                        case 3:
                            poseLandmarksByRoiResult = _b.sent();
                            image3d.dispose();
                            if (poseLandmarksByRoiResult == null) {
                                this.reset();
                                return [2 /*return*/, []];
                            }
                            unfilteredPoseLandmarks = poseLandmarksByRoiResult.landmarks, unfilteredAuxiliaryLandmarks = poseLandmarksByRoiResult.auxiliaryLandmarks, poseScore = poseLandmarksByRoiResult.poseScore, unfilteredWorldLandmarks = poseLandmarksByRoiResult.worldLandmarks, unfilteredSegmentationMask = poseLandmarksByRoiResult.segmentationMask;
                            _a = this.poseLandmarkFiltering(unfilteredPoseLandmarks, unfilteredAuxiliaryLandmarks, unfilteredWorldLandmarks, imageSize), poseLandmarks = _a.actualLandmarksFiltered, auxiliaryLandmarks = _a.auxiliaryLandmarksFiltered, poseWorldLandmarks = _a.actualWorldLandmarksFiltered;
                            poseRectFromLandmarks = this.poseLandmarksToRoi(auxiliaryLandmarks, imageSize);
                            // Cache roi for next image.
                            this.regionOfInterest = poseRectFromLandmarks;
                            filteredSegmentationMask = this.smoothSegmentation && unfilteredSegmentationMask != null ?
                                this.poseSegmentationFiltering(unfilteredSegmentationMask) :
                                unfilteredSegmentationMask;
                            keypoints = poseLandmarks != null ?
                                normalizedKeypointsToKeypoints(poseLandmarks, imageSize) :
                                null;
                            // Add keypoint name.
                            if (keypoints != null) {
                                keypoints.forEach(function (keypoint, i) {
                                    keypoint.name = BLAZEPOSE_KEYPOINTS[i];
                                });
                            }
                            keypoints3D = poseWorldLandmarks;
                            // Add keypoint name.
                            if (keypoints3D != null) {
                                keypoints3D.forEach(function (keypoint3D, i) {
                                    keypoint3D.name = BLAZEPOSE_KEYPOINTS[i];
                                });
                            }
                            pose = { score: poseScore, keypoints: keypoints, keypoints3D: keypoints3D };
                            if (filteredSegmentationMask !== null) {
                                rgbaMask = tf.tidy(function () {
                                    var mask3D = 
                                    // tslint:disable-next-line: no-unnecessary-type-assertion
                                    tf.expandDims(filteredSegmentationMask, 2);
                                    // Pads a pixel [r] to [r, 0].
                                    var rgMask = tf.pad(mask3D, [[0, 0], [0, 0], [0, 1]]);
                                    // Pads a pixel [r, 0] to [r, 0, 0, r].
                                    return tf.mirrorPad(rgMask, [[0, 0], [0, 0], [0, 2]], 'symmetric');
                                });
                                if (!this.smoothSegmentation) {
                                    tf.dispose(filteredSegmentationMask);
                                }
                                segmentation = {
                                    maskValueToLabel: maskValueToLabel$1,
                                    mask: new BlazePoseTfjsMask(rgbaMask)
                                };
                                pose.segmentation = segmentation;
                            }
                            return [2 /*return*/, [pose]];
                    }
                });
            });
        };
        BlazePoseTfjsDetector.prototype.poseSegmentationFiltering = function (segmentationMask) {
            var prevMask = this.prevFilteredSegmentationMask;
            if (prevMask.size === 0) {
                this.prevFilteredSegmentationMask = segmentationMask;
            }
            else {
                this.prevFilteredSegmentationMask = smoothSegmentation(prevMask, segmentationMask, BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG);
                tf.dispose(segmentationMask);
            }
            tf.dispose(prevMask);
            return this.prevFilteredSegmentationMask;
        };
        BlazePoseTfjsDetector.prototype.dispose = function () {
            this.detectorModel.dispose();
            this.landmarkModel.dispose();
            tf.dispose([
                this.anchorTensor.x, this.anchorTensor.y, this.anchorTensor.w,
                this.anchorTensor.h, this.prevFilteredSegmentationMask
            ]);
        };
        BlazePoseTfjsDetector.prototype.reset = function () {
            this.regionOfInterest = null;
            if (this.enableSegmentation) {
                tf.dispose(this.prevFilteredSegmentationMask);
                this.prevFilteredSegmentationMask = tf.tensor2d([], [0, 0]);
            }
            this.visibilitySmoothingFilterActual = null;
            this.visibilitySmoothingFilterAuxiliary = null;
            this.landmarksSmoothingFilterActual = null;
            this.landmarksSmoothingFilterAuxiliary = null;
        };
        // Detects poses.
        // Subgraph: PoseDetectionCpu.
        // ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_detection/pose_detection_cpu.pbtxt
        BlazePoseTfjsDetector.prototype.detectPose = function (image) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, imageValueShifted, padding, _b, boxes, logits, detections, selectedDetections, newDetections;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = convertImageToTensor(image, BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG), imageValueShifted = _a.imageTensor, padding = _a.padding;
                            _b = detectorInference(imageValueShifted, this.detectorModel), boxes = _b.boxes, logits = _b.logits;
                            return [4 /*yield*/, tensorsToDetections([logits, boxes], this.anchorTensor, BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION)];
                        case 1:
                            detections = _c.sent();
                            if (detections.length === 0) {
                                tf.dispose([imageValueShifted, logits, boxes]);
                                return [2 /*return*/, detections];
                            }
                            return [4 /*yield*/, nonMaxSuppression(detections, this.maxPoses, BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                                    .minSuppressionThreshold)];
                        case 2:
                            selectedDetections = _c.sent();
                            newDetections = removeDetectionLetterbox(selectedDetections, padding);
                            tf.dispose([imageValueShifted, logits, boxes]);
                            return [2 /*return*/, newDetections];
                    }
                });
            });
        };
        // Calculates region of interest from a detection.
        // Subgraph: PoseDetectionToRoi.
        // ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_detection_to_roi.pbtxt
        // If detection is not null, imageSize should not be null either.
        BlazePoseTfjsDetector.prototype.poseDetectionToRoi = function (detection, imageSize) {
            var startKeypointIndex;
            var endKeypointIndex;
            // Converts pose detection into a rectangle based on center and scale
            // alignment points.
            startKeypointIndex = 0;
            endKeypointIndex = 1;
            // PoseDetectionToRoi: AlignmentPointsRectsCalculator.
            var rawRoi = calculateAlignmentPointsRects(detection, imageSize, {
                rotationVectorEndKeypointIndex: endKeypointIndex,
                rotationVectorStartKeypointIndex: startKeypointIndex,
                rotationVectorTargetAngleDegree: 90
            });
            // Expands pose rect with marging used during training.
            // PoseDetectionToRoi: RectTransformationCalculation.
            var roi = transformNormalizedRect(rawRoi, imageSize, BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
            return roi;
        };
        // Predict pose landmarks  and optionally segmentation within an ROI
        // subgraph: PoseLandmarksByRoiCpu
        // ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_by_roi_cpu.pbtxt
        // When poseRect is not null, image should not be null either.
        BlazePoseTfjsDetector.prototype.poseLandmarksByRoi = function (roi, image) {
            return __awaiter(this, void 0, void 0, function () {
                var imageSize, _a, imageValueShifted, letterboxPadding, transformationMatrix, outputTensor, tensorsToPoseLandmarksAndSegmentationResult, roiLandmarks, roiAuxiliaryLandmarks, poseScore, roiWorldLandmarks, roiSegmentationMask, poseLandmarksAndSegmentationInverseProjectionResults;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            imageSize = getImageSize(image);
                            _a = convertImageToTensor(image, BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG, roi), imageValueShifted = _a.imageTensor, letterboxPadding = _a.padding, transformationMatrix = _a.transformationMatrix;
                            if (this.modelType !== 'lite' && this.modelType !== 'full' &&
                                this.modelType !== 'heavy') {
                                throw new Error('Model type must be one of lite, full or heavy,' +
                                    ("but got " + this.modelType));
                            }
                            outputTensor = this.landmarkModel.execute(imageValueShifted, [
                                'ld_3d', 'output_poseflag', 'activation_segmentation',
                                'activation_heatmap', 'world_3d'
                            ]);
                            return [4 /*yield*/, this.tensorsToPoseLandmarksAndSegmentation(outputTensor)];
                        case 1:
                            tensorsToPoseLandmarksAndSegmentationResult = _b.sent();
                            if (tensorsToPoseLandmarksAndSegmentationResult == null) {
                                tf.dispose(outputTensor);
                                tf.dispose(imageValueShifted);
                                return [2 /*return*/, null];
                            }
                            roiLandmarks = tensorsToPoseLandmarksAndSegmentationResult.landmarks, roiAuxiliaryLandmarks = tensorsToPoseLandmarksAndSegmentationResult.auxiliaryLandmarks, poseScore = tensorsToPoseLandmarksAndSegmentationResult.poseScore, roiWorldLandmarks = tensorsToPoseLandmarksAndSegmentationResult.worldLandmarks, roiSegmentationMask = tensorsToPoseLandmarksAndSegmentationResult.segmentationMask;
                            return [4 /*yield*/, this.poseLandmarksAndSegmentationInverseProjection(imageSize, roi, letterboxPadding, transformationMatrix, roiLandmarks, roiAuxiliaryLandmarks, roiWorldLandmarks, roiSegmentationMask)];
                        case 2:
                            poseLandmarksAndSegmentationInverseProjectionResults = _b.sent();
                            tf.dispose(outputTensor);
                            tf.dispose(imageValueShifted);
                            return [2 /*return*/, __assign({ poseScore: poseScore }, poseLandmarksAndSegmentationInverseProjectionResults)];
                    }
                });
            });
        };
        BlazePoseTfjsDetector.prototype.poseLandmarksAndSegmentationInverseProjection = function (imageSize, roi, letterboxPadding, transformationMatrix, roiLandmarks, roiAuxiliaryLandmarks, roiWorldLandmarks, roiSegmentationMask) {
            return __awaiter(this, void 0, void 0, function () {
                var adjustedLandmarks, adjustedAuxiliaryLandmarks, landmarks, auxiliaryLandmarks, worldLandmarks, segmentationMask;
                return __generator(this, function (_a) {
                    adjustedLandmarks = removeLandmarkLetterbox(roiLandmarks, letterboxPadding);
                    adjustedAuxiliaryLandmarks = removeLandmarkLetterbox(roiAuxiliaryLandmarks, letterboxPadding);
                    landmarks = calculateLandmarkProjection(adjustedLandmarks, roi);
                    auxiliaryLandmarks = calculateLandmarkProjection(adjustedAuxiliaryLandmarks, roi);
                    worldLandmarks = calculateWorldLandmarkProjection(roiWorldLandmarks, roi);
                    segmentationMask = null;
                    if (this.enableSegmentation) {
                        segmentationMask = tf.tidy(function () {
                            var _a = roiSegmentationMask.shape, inputHeight = _a[0], inputWidth = _a[1];
                            // Calculates the inverse transformation matrix.
                            // PoseLandmarksAndSegmentationInverseProjection:
                            // InverseMatrixCalculator.
                            var inverseTransformationMatrix = calculateInverseMatrix(transformationMatrix);
                            var projectiveTransform = tf.tensor2d(getProjectiveTransformMatrix(inverseTransformationMatrix, { width: inputWidth, height: inputHeight }, imageSize), [1, 8]);
                            // Projects the segmentation mask from the letterboxed ROI back to the
                            // full image.
                            // PoseLandmarksAndSegmentationInverseProjection: WarpAffineCalculator.
                            var shape4D = [1, inputHeight, inputWidth, 1];
                            return tf.squeeze(tf.image.transform(tf.reshape(roiSegmentationMask, shape4D), projectiveTransform, 'bilinear', 'constant', 0, [imageSize.height, imageSize.width]), [0, 3]);
                        });
                        tf.dispose(roiSegmentationMask);
                    }
                    return [2 /*return*/, { landmarks: landmarks, auxiliaryLandmarks: auxiliaryLandmarks, worldLandmarks: worldLandmarks, segmentationMask: segmentationMask }];
                });
            });
        };
        BlazePoseTfjsDetector.prototype.tensorsToPoseLandmarksAndSegmentation = function (tensors) {
            return __awaiter(this, void 0, void 0, function () {
                var landmarkTensor, poseFlagTensor, segmentationTensor, heatmapTensor, worldLandmarkTensor, poseScore, rawLandmarks, allLandmarks, landmarks, auxiliaryLandmarks, allWorldLandmarks, worldLandmarksWithoutVisibility, worldLandmarks, segmentationMask;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            landmarkTensor = tensors[0], poseFlagTensor = tensors[1], segmentationTensor = tensors[2], heatmapTensor = tensors[3], worldLandmarkTensor = tensors[4];
                            return [4 /*yield*/, poseFlagTensor.data()];
                        case 1:
                            poseScore = (_a.sent())[0];
                            // Applies a threshold to the confidence score to determine whether a pose
                            // is present.
                            if (poseScore < BLAZEPOSE_POSE_PRESENCE_SCORE) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, tensorsToLandmarks(landmarkTensor, BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG)];
                        case 2:
                            rawLandmarks = _a.sent();
                            return [4 /*yield*/, refineLandmarksFromHeatmap(rawLandmarks, heatmapTensor, BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG)];
                        case 3:
                            allLandmarks = _a.sent();
                            landmarks = allLandmarks.slice(0, BLAZEPOSE_NUM_KEYPOINTS);
                            auxiliaryLandmarks = allLandmarks.slice(BLAZEPOSE_NUM_KEYPOINTS, BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS);
                            return [4 /*yield*/, tensorsToLandmarks(worldLandmarkTensor, BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG)];
                        case 4:
                            allWorldLandmarks = _a.sent();
                            worldLandmarksWithoutVisibility = allWorldLandmarks.slice(0, BLAZEPOSE_NUM_KEYPOINTS);
                            worldLandmarks = calculateScoreCopy(landmarks, worldLandmarksWithoutVisibility, true);
                            segmentationMask = this.enableSegmentation ?
                                tensorsToSegmentation(segmentationTensor, BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG) :
                                null;
                            return [2 /*return*/, {
                                    landmarks: landmarks,
                                    auxiliaryLandmarks: auxiliaryLandmarks,
                                    poseScore: poseScore,
                                    worldLandmarks: worldLandmarks,
                                    segmentationMask: segmentationMask
                                }];
                    }
                });
            });
        };
        // Calculate region of interest (ROI) from landmarks.
        // Subgraph: PoseLandmarksToRoiCpu
        // ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmarks_to_roi.pbtxt
        // When landmarks is not null, imageSize should not be null either.
        BlazePoseTfjsDetector.prototype.poseLandmarksToRoi = function (landmarks, imageSize) {
            // PoseLandmarksToRoi: LandmarksToDetectionCalculator.
            var detection = landmarksToDetection(landmarks);
            // Converts detection into a rectangle based on center and scale alignment
            // points.
            // PoseLandmarksToRoi: AlignmentPointsRectsCalculator.
            var rawRoi = calculateAlignmentPointsRects(detection, imageSize, {
                rotationVectorStartKeypointIndex: 0,
                rotationVectorEndKeypointIndex: 1,
                rotationVectorTargetAngleDegree: 90
            });
            // Expands pose rect with marging used during training.
            // PoseLandmarksToRoi: RectTransformationCalculator.
            var roi = transformNormalizedRect(rawRoi, imageSize, BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
            return roi;
        };
        // Filter landmarks temporally to reduce jitter.
        // Subgraph: PoseLandmarkFiltering
        // ref:
        // https://github.com/google/mediapipe/blob/master/mediapipe/modules/pose_landmark/pose_landmark_filtering.pbtxt
        BlazePoseTfjsDetector.prototype.poseLandmarkFiltering = function (actualLandmarks, auxiliaryLandmarks, actualWorldLandmarks, imageSize) {
            var actualLandmarksFiltered;
            var auxiliaryLandmarksFiltered;
            var actualWorldLandmarksFiltered;
            if (this.timestamp == null || !this.enableSmoothing) {
                actualLandmarksFiltered = actualLandmarks;
                auxiliaryLandmarksFiltered = auxiliaryLandmarks;
                actualWorldLandmarksFiltered = actualWorldLandmarks;
            }
            else {
                var auxDetection = landmarksToDetection(auxiliaryLandmarks);
                var objectScaleROI = calculateAlignmentPointsRects(auxDetection, imageSize, {
                    rotationVectorEndKeypointIndex: 0,
                    rotationVectorStartKeypointIndex: 1,
                    rotationVectorTargetAngleDegree: 90
                });
                // Smoothes pose landmark visibilities to reduce jitter.
                if (this.visibilitySmoothingFilterActual == null) {
                    this.visibilitySmoothingFilterActual = new LowPassVisibilityFilter(BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
                }
                actualLandmarksFiltered =
                    this.visibilitySmoothingFilterActual.apply(actualLandmarks);
                if (this.visibilitySmoothingFilterAuxiliary == null) {
                    this.visibilitySmoothingFilterAuxiliary = new LowPassVisibilityFilter(BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
                }
                auxiliaryLandmarksFiltered =
                    this.visibilitySmoothingFilterAuxiliary.apply(auxiliaryLandmarks);
                actualWorldLandmarksFiltered =
                    this.visibilitySmoothingFilterActual.apply(actualWorldLandmarks);
                // Smoothes pose landmark coordinates to reduce jitter.
                if (this.landmarksSmoothingFilterActual == null) {
                    this.landmarksSmoothingFilterActual = new KeypointsSmoothingFilter(BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
                }
                actualLandmarksFiltered = this.landmarksSmoothingFilterActual.apply(actualLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
                if (this.landmarksSmoothingFilterAuxiliary == null) {
                    this.landmarksSmoothingFilterAuxiliary = new KeypointsSmoothingFilter(BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY);
                }
                auxiliaryLandmarksFiltered = this.landmarksSmoothingFilterAuxiliary.apply(auxiliaryLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
                // Smoothes pose world landmark coordinates to reduce jitter.
                if (this.worldLandmarksSmoothingFilterActual == null) {
                    this.worldLandmarksSmoothingFilterActual = new KeypointsSmoothingFilter(BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
                }
                actualWorldLandmarksFiltered =
                    this.worldLandmarksSmoothingFilterActual.apply(actualWorldLandmarks, this.timestamp);
            }
            return {
                actualLandmarksFiltered: actualLandmarksFiltered,
                auxiliaryLandmarksFiltered: auxiliaryLandmarksFiltered,
                actualWorldLandmarksFiltered: actualWorldLandmarksFiltered
            };
        };
        return BlazePoseTfjsDetector;
    }());
    /**
     * Loads the BlazePose model.
     *
     * @param modelConfig ModelConfig object that contains parameters for
     * the BlazePose loading process. Please find more details of each parameters
     * in the documentation of the `BlazePoseTfjsModelConfig` interface.
     */
    function load$1(modelConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var config, detectorFromTFHub, landmarkFromTFHub, _a, detectorModel, landmarkModel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config = validateModelConfig$1(modelConfig);
                        detectorFromTFHub = typeof config.detectorModelUrl === 'string' &&
                            (config.detectorModelUrl.indexOf('https://tfhub.dev') > -1);
                        landmarkFromTFHub = typeof config.landmarkModelUrl === 'string' &&
                            (config.landmarkModelUrl.indexOf('https://tfhub.dev') > -1);
                        return [4 /*yield*/, Promise.all([
                                tfconv.loadGraphModel(config.detectorModelUrl, { fromTFHub: detectorFromTFHub }),
                                tfconv.loadGraphModel(config.landmarkModelUrl, { fromTFHub: landmarkFromTFHub })
                            ])];
                    case 1:
                        _a = _b.sent(), detectorModel = _a[0], landmarkModel = _a[1];
                        return [2 /*return*/, new BlazePoseTfjsDetector(detectorModel, landmarkModel, config.enableSmoothing, config.enableSegmentation, config.smoothSegmentation, config.modelType)];
                }
            });
        });
    }

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
    function validateTrackerConfig(config) {
        if (config.maxTracks < 1) {
            throw new Error("Must specify 'maxTracks' to be at least 1, but " +
                ("encountered " + config.maxTracks));
        }
        if (config.maxAge <= 0) {
            throw new Error("Must specify 'maxAge' to be positive, but " +
                ("encountered " + config.maxAge));
        }
        if (config.keypointTrackerParams !== undefined) {
            if (config.keypointTrackerParams.keypointConfidenceThreshold < 0 ||
                config.keypointTrackerParams.keypointConfidenceThreshold > 1) {
                throw new Error("Must specify 'keypointConfidenceThreshold' to be in the range " +
                    "[0, 1], but encountered " +
                    ("" + config.keypointTrackerParams.keypointConfidenceThreshold));
            }
            if (config.keypointTrackerParams.minNumberOfKeypoints < 1) {
                throw new Error("Must specify 'minNumberOfKeypoints' to be at least 1, but " +
                    ("encountered " + config.keypointTrackerParams.minNumberOfKeypoints));
            }
            for (var _i = 0, _a = config.keypointTrackerParams.keypointFalloff; _i < _a.length; _i++) {
                var falloff = _a[_i];
                if (falloff <= 0.0) {
                    throw new Error("Must specify each keypoint falloff parameterto be positive " +
                        ("but encountered " + falloff));
                }
            }
        }
    }

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
     * A stateful tracker for associating detections between frames. This is an
     * abstract base class that performs generic mechanics. Implementations must
     * inherit from this class.
     */
    var Tracker = /** @class */ (function () {
        function Tracker(config) {
            validateTrackerConfig(config);
            this.tracks = [];
            this.maxTracks = config.maxTracks;
            this.maxAge = config.maxAge * 1000; // Convert msec to usec.
            this.minSimilarity = config.minSimilarity;
            this.nextID = 1;
        }
        /**
         * Tracks person instances across frames based on detections.
         * @param poses An array of detected `Pose`s.
         * @param timestamp The timestamp associated with the incoming poses, in
         * microseconds.
         * @returns An updated array of `Pose`s with tracking id properties.
         */
        Tracker.prototype.apply = function (poses, timestamp) {
            this.filterOldTracks(timestamp);
            var simMatrix = this.computeSimilarity(poses);
            this.assignTracks(poses, simMatrix, timestamp);
            this.updateTracks(timestamp);
            return poses;
        };
        /**
         * Returns a copy of the stored tracks.
         */
        Tracker.prototype.getTracks = function () {
            return this.tracks.slice();
        };
        /**
         * Returns a Set of active track IDs.
         */
        Tracker.prototype.getTrackIDs = function () {
            return new Set(this.tracks.map(function (track) { return track.id; }));
        };
        /**
         * Filters tracks based on their age.
         * @param timestamp The current timestamp in microseconds.
         */
        Tracker.prototype.filterOldTracks = function (timestamp) {
            var _this = this;
            this.tracks = this.tracks.filter(function (track) {
                return timestamp - track.lastTimestamp <= _this.maxAge;
            });
        };
        /**
         * Performs a greedy optimization to link detections with tracks. The `poses`
         * array is updated in place by providing an `id` property. If incoming
         * detections are not linked with existing tracks, new tracks will be created.
         * @param poses An array of detected `Pose`s. It's assumed that poses are
         * sorted from most confident to least confident.
         * @param simMatrix A 2D array of shape [num_det, num_tracks] with pairwise
         * similarity scores between detections and tracks.
         * @param timestamp The current timestamp in microseconds.
         */
        Tracker.prototype.assignTracks = function (poses, simMatrix, timestamp) {
            var unmatchedTrackIndices = Array.from(Array(simMatrix[0].length).keys());
            var detectionIndices = Array.from(Array(poses.length).keys());
            var unmatchedDetectionIndices = [];
            for (var _i = 0, detectionIndices_1 = detectionIndices; _i < detectionIndices_1.length; _i++) {
                var detectionIndex = detectionIndices_1[_i];
                if (unmatchedTrackIndices.length === 0) {
                    unmatchedDetectionIndices.push(detectionIndex);
                    continue;
                }
                // Assign the detection to the track which produces the highest pairwise
                // similarity score, assuming the score exceeds the minimum similarity
                // threshold.
                var maxTrackIndex = -1;
                var maxSimilarity = -1;
                for (var _a = 0, unmatchedTrackIndices_1 = unmatchedTrackIndices; _a < unmatchedTrackIndices_1.length; _a++) {
                    var trackIndex = unmatchedTrackIndices_1[_a];
                    var similarity = simMatrix[detectionIndex][trackIndex];
                    if (similarity >= this.minSimilarity && similarity > maxSimilarity) {
                        maxTrackIndex = trackIndex;
                        maxSimilarity = similarity;
                    }
                }
                if (maxTrackIndex >= 0) {
                    // Link the detection with the highest scoring track.
                    var linkedTrack = this.tracks[maxTrackIndex];
                    linkedTrack = Object.assign(linkedTrack, this.createTrack(poses[detectionIndex], timestamp, linkedTrack.id));
                    poses[detectionIndex].id = linkedTrack.id;
                    var index = unmatchedTrackIndices.indexOf(maxTrackIndex);
                    unmatchedTrackIndices.splice(index, 1);
                }
                else {
                    unmatchedDetectionIndices.push(detectionIndex);
                }
            }
            // Spawn new tracks for all unmatched detections.
            for (var _b = 0, unmatchedDetectionIndices_1 = unmatchedDetectionIndices; _b < unmatchedDetectionIndices_1.length; _b++) {
                var detectionIndex = unmatchedDetectionIndices_1[_b];
                var newTrack = this.createTrack(poses[detectionIndex], timestamp);
                this.tracks.push(newTrack);
                poses[detectionIndex].id = newTrack.id;
            }
        };
        /**
         * Updates the stored tracks in the tracker. Specifically, the following
         * operations are applied in order:
         * 1. Tracks are sorted based on freshness (i.e. the most recently linked
         *    tracks are placed at the beginning of the array and the most stale are
         *    at the end).
         * 2. The tracks array is sliced to only contain `maxTracks` tracks (i.e. the
         *    most fresh tracks).
         * @param timestamp The current timestamp in microseconds.
         */
        Tracker.prototype.updateTracks = function (timestamp) {
            // Sort tracks from most recent to most stale, and then only keep the top
            // `maxTracks` tracks.
            this.tracks.sort(function (ta, tb) { return tb.lastTimestamp - ta.lastTimestamp; });
            this.tracks = this.tracks.slice(0, this.maxTracks);
        };
        /**
         * Creates a track from information in a pose.
         * @param pose A `Pose`.
         * @param timestamp The current timestamp in microseconds.
         * @param trackID The id to assign to the new track. If not provided,
         * will assign the next available id.
         * @returns A `Track`.
         */
        Tracker.prototype.createTrack = function (pose, timestamp, trackID) {
            var track = {
                id: trackID || this.nextTrackID(),
                lastTimestamp: timestamp,
                keypoints: __spreadArrays(pose.keypoints).map(function (keypoint) { return (__assign({}, keypoint)); })
            };
            if (pose.box !== undefined) {
                track.box = __assign({}, pose.box);
            }
            return track;
        };
        /**
         * Returns the next free track ID.
         */
        Tracker.prototype.nextTrackID = function () {
            var nextID = this.nextID;
            this.nextID += 1;
            return nextID;
        };
        /**
         * Removes specific tracks, based on their ids.
         */
        Tracker.prototype.remove = function () {
            var ids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ids[_i] = arguments[_i];
            }
            this.tracks = this.tracks.filter(function (track) { return !ids.includes(track.id); });
        };
        /**
         * Resets tracks.
         */
        Tracker.prototype.reset = function () {
            this.tracks = [];
        };
        return Tracker;
    }());

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
    }(Tracker));

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
     * KeypointTracker, which tracks poses based on keypoint similarity. This
     * tracker assumes that keypoints are provided in normalized image
     * coordinates.
     */
    var KeypointTracker = /** @class */ (function (_super) {
        __extends(KeypointTracker, _super);
        function KeypointTracker(config) {
            var _this = _super.call(this, config) || this;
            _this.keypointThreshold =
                config.keypointTrackerParams.keypointConfidenceThreshold;
            _this.keypointFalloff = config.keypointTrackerParams.keypointFalloff;
            _this.minNumKeyoints = config.keypointTrackerParams.minNumberOfKeypoints;
            return _this;
        }
        /**
         * Computes similarity based on Object Keypoint Similarity (OKS). It's
         * assumed that the keypoints within each `Pose` are in normalized image
         * coordinates. See `Tracker` for more details.
         */
        KeypointTracker.prototype.computeSimilarity = function (poses) {
            if (poses.length === 0 || this.tracks.length === 0) {
                return [[]];
            }
            var simMatrix = [];
            for (var _i = 0, poses_1 = poses; _i < poses_1.length; _i++) {
                var pose = poses_1[_i];
                var row = [];
                for (var _a = 0, _b = this.tracks; _a < _b.length; _a++) {
                    var track = _b[_a];
                    row.push(this.oks(pose, track));
                }
                simMatrix.push(row);
            }
            return simMatrix;
        };
        /**
         * Computes the Object Keypoint Similarity (OKS) between a pose and track.
         * This is similar in spirit to the calculation used by COCO keypoint eval:
         * https://cocodataset.org/#keypoints-eval
         * In this case, OKS is calculated as:
         * (1/sum_i d(c_i, c_ti)) * \sum_i exp(-d_i^2/(2*a_ti*x_i^2))*d(c_i, c_ti)
         * where
         *   d(x, y) is an indicator function which only produces 1 if x and y
         *     exceed a given threshold (i.e. keypointThreshold), otherwise 0.
         *   c_i is the confidence of keypoint i from the new pose
         *   c_ti is the confidence of keypoint i from the track
         *   d_i is the Euclidean distance between the pose and track keypoint
         *   a_ti is the area of the track object (the box covering the keypoints)
         *   x_i is a constant that controls falloff in a Gaussian distribution,
         *    computed as 2*keypointFalloff[i].
         * @param pose A `Pose`.
         * @param track A `Track`.
         * @returns The OKS score between the pose and the track. This number is
         * between 0 and 1, and larger values indicate more keypoint similarity.
         */
        KeypointTracker.prototype.oks = function (pose, track) {
            var boxArea = this.area(track.keypoints) + 1e-6;
            var oksTotal = 0;
            var numValidKeypoints = 0;
            for (var i = 0; i < pose.keypoints.length; ++i) {
                var poseKpt = pose.keypoints[i];
                var trackKpt = track.keypoints[i];
                if (poseKpt.score < this.keypointThreshold ||
                    trackKpt.score < this.keypointThreshold) {
                    continue;
                }
                numValidKeypoints += 1;
                var dSquared = Math.pow(poseKpt.x - trackKpt.x, 2) +
                    Math.pow(poseKpt.y - trackKpt.y, 2);
                var x = 2 * this.keypointFalloff[i];
                oksTotal += Math.exp(-1 * dSquared / (2 * boxArea * Math.pow(x, 2)));
            }
            if (numValidKeypoints < this.minNumKeyoints) {
                return 0.0;
            }
            return oksTotal / numValidKeypoints;
        };
        /**
         * Computes the area of a bounding box that tightly covers keypoints.
         * @param Keypoint[] An array of `Keypoint`s.
         * @returns The area of the object.
         */
        KeypointTracker.prototype.area = function (keypoints) {
            var _this = this;
            var validKeypoint = keypoints.filter(function (kpt) { return kpt.score > _this.keypointThreshold; });
            var minX = Math.min.apply(Math, __spreadArrays([1.0], validKeypoint.map(function (kpt) { return kpt.x; })));
            var maxX = Math.max.apply(Math, __spreadArrays([0.0], validKeypoint.map(function (kpt) { return kpt.x; })));
            var minY = Math.min.apply(Math, __spreadArrays([1.0], validKeypoint.map(function (kpt) { return kpt.y; })));
            var maxY = Math.max.apply(Math, __spreadArrays([0.0], validKeypoint.map(function (kpt) { return kpt.y; })));
            return (maxX - minX) * (maxY - minY);
        };
        return KeypointTracker;
    }(Tracker));

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
    (function (TrackerType) {
        TrackerType["Keypoint"] = "keypoint";
        TrackerType["BoundingBox"] = "boundingBox";
    })(exports.TrackerType || (exports.TrackerType = {}));

    (function (SupportedModels) {
        SupportedModels["MoveNet"] = "MoveNet";
        SupportedModels["BlazePose"] = "BlazePose";
        SupportedModels["PoseNet"] = "PoseNet";
    })(exports.SupportedModels || (exports.SupportedModels = {}));

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
    function getKeypointIndexBySide(model) {
        switch (model) {
            case exports.SupportedModels.BlazePose:
                return BLAZEPOSE_KEYPOINTS_BY_SIDE;
            case exports.SupportedModels.PoseNet:
            case exports.SupportedModels.MoveNet:
                return COCO_KEYPOINTS_BY_SIDE;
            default:
                throw new Error("Model " + model + " is not supported.");
        }
    }
    function getAdjacentPairs(model) {
        switch (model) {
            case exports.SupportedModels.BlazePose:
                return BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS;
            case exports.SupportedModels.PoseNet:
            case exports.SupportedModels.MoveNet:
                return COCO_CONNECTED_KEYPOINTS_PAIRS;
            default:
                throw new Error("Model " + model + " is not supported.");
        }
    }
    function getKeypointIndexByName(model) {
        switch (model) {
            case exports.SupportedModels.BlazePose:
                return BLAZEPOSE_KEYPOINTS.reduce(function (map, name, i) {
                    map[name] = i;
                    return map;
                }, {});
            case exports.SupportedModels.PoseNet:
            case exports.SupportedModels.MoveNet:
                return COCO_KEYPOINTS.reduce(function (map, name, i) {
                    map[name] = i;
                    return map;
                }, {});
            default:
                throw new Error("Model " + model + " is not supported.");
        }
    }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getKeypointIndexBySide: getKeypointIndexBySide,
        getAdjacentPairs: getAdjacentPairs,
        getKeypointIndexByName: getKeypointIndexByName
    });

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
    var SINGLEPOSE_LIGHTNING = 'SinglePose.Lightning';
    var SINGLEPOSE_THUNDER = 'SinglePose.Thunder';
    var MULTIPOSE_LIGHTNING = 'MultiPose.Lightning';
    var VALID_MODELS = [SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING];
    var MOVENET_SINGLEPOSE_LIGHTNING_URL = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4';
    var MOVENET_SINGLEPOSE_THUNDER_URL = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4';
    var MOVENET_MULTIPOSE_LIGHTNING_URL = 'https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1';
    var MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION = 192;
    var MOVENET_SINGLEPOSE_THUNDER_RESOLUTION = 256;
    var MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION = 256;
    // The default configuration for loading MoveNet.
    var MOVENET_CONFIG = {
        modelType: SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
    };
    var MOVENET_ESTIMATION_CONFIG = {};
    var KEYPOINT_FILTER_CONFIG = {
        frequency: 30,
        minCutOff: 2.5,
        beta: 300.0,
        derivateCutOff: 2.5,
        thresholdCutOff: 0.5,
        thresholdBeta: 5.0,
        disableValueScaling: true,
    };
    var CROP_FILTER_ALPHA = 0.9;
    var MIN_CROP_KEYPOINT_SCORE = 0.2;
    var DEFAULT_MIN_POSE_SCORE = 0.25;
    var NUM_KEYPOINTS = 17;
    var NUM_KEYPOINT_VALUES = 3; // [y, x, score]
    var MULTIPOSE_BOX_SIZE = 5; // [ymin, xmin, ymax, xmax, score]
    var MULTIPOSE_BOX_IDX = NUM_KEYPOINTS * NUM_KEYPOINT_VALUES;
    var MULTIPOSE_BOX_SCORE_IDX = MULTIPOSE_BOX_IDX + 4;
    var MULTIPOSE_INSTANCE_SIZE = NUM_KEYPOINTS * NUM_KEYPOINT_VALUES + MULTIPOSE_BOX_SIZE;
    var DEFAULT_KEYPOINT_TRACKER_CONFIG = {
        maxTracks: 18,
        maxAge: 1000,
        minSimilarity: 0.2,
        keypointTrackerParams: {
            keypointConfidenceThreshold: 0.3,
            // From COCO:
            // https://cocodataset.org/#keypoints-eval
            keypointFalloff: [
                0.026, 0.025, 0.025, 0.035, 0.035, 0.079, 0.079, 0.072, 0.072, 0.062,
                0.062, 0.107, 0.107, 0.087, 0.087, 0.089, 0.089
            ],
            minNumberOfKeypoints: 4
        }
    };
    var DEFAULT_BOUNDING_BOX_TRACKER_CONFIG = {
        maxTracks: 18,
        maxAge: 1000,
        minSimilarity: 0.15,
        trackerParams: {}
    };

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
     * Determines whether the torso of a person is visible.
     *
     * @param keypoints An array of `Keypoint`s associated with a person.
     * @param keypointIndexByName A map from keypoint name to index in the keypoints
     *     array.
     * @return A boolean indicating whether the torso is visible.
     */
    function torsoVisible(keypoints, keypointIndexByName) {
        return ((keypoints[keypointIndexByName['left_hip']].score >
            MIN_CROP_KEYPOINT_SCORE ||
            keypoints[keypointIndexByName['right_hip']].score >
                MIN_CROP_KEYPOINT_SCORE) &&
            (keypoints[keypointIndexByName['left_shoulder']].score >
                MIN_CROP_KEYPOINT_SCORE ||
                keypoints[keypointIndexByName['right_shoulder']].score >
                    MIN_CROP_KEYPOINT_SCORE));
    }
    /**
     * Calculates the maximum distance from each keypoint to the center location.
     * The function returns the maximum distances from the two sets of keypoints:
     * full 17 keypoints and 4 torso keypoints. The returned information will be
     * used to determine the crop size. See determineCropRegion for more detail.
     *
     * @param keypoints An array of `Keypoint`s associated with a person.
     * @param keypointIndexByName A map from keypoint name to index in the keypoints
     *     array.
     * @param targetKeypoints Maps from joint names to coordinates.
     * @param centerY The Y coordinate of the center of the person.
     * @param centerX The X coordinate of the center of the person.
     * @return An array containing information about the torso and body range in the
     *     image: [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange].
     */
    function determineTorsoAndBodyRange(keypoints, keypointIndexByName, targetKeypoints, centerY, centerX) {
        var torsoJoints = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'];
        var maxTorsoYrange = 0.0;
        var maxTorsoXrange = 0.0;
        for (var i = 0; i < torsoJoints.length; i++) {
            var distY = Math.abs(centerY - targetKeypoints[torsoJoints[i]][0]);
            var distX = Math.abs(centerX - targetKeypoints[torsoJoints[i]][1]);
            if (distY > maxTorsoYrange) {
                maxTorsoYrange = distY;
            }
            if (distX > maxTorsoXrange) {
                maxTorsoXrange = distX;
            }
        }
        var maxBodyYrange = 0.0;
        var maxBodyXrange = 0.0;
        for (var _i = 0, _a = Object.keys(targetKeypoints); _i < _a.length; _i++) {
            var key = _a[_i];
            if (keypoints[keypointIndexByName[key]].score < MIN_CROP_KEYPOINT_SCORE) {
                continue;
            }
            var distY = Math.abs(centerY - targetKeypoints[key][0]);
            var distX = Math.abs(centerX - targetKeypoints[key][1]);
            if (distY > maxBodyYrange) {
                maxBodyYrange = distY;
            }
            if (distX > maxBodyXrange) {
                maxBodyXrange = distX;
            }
        }
        return [maxTorsoYrange, maxTorsoXrange, maxBodyYrange, maxBodyXrange];
    }
    /**
     * Determines the region to crop the image for the model to run inference on.
     * The algorithm uses the detected joints from the previous frame to estimate
     * the square region that encloses the full body of the target person and
     * centers at the midpoint of two hip joints. The crop size is determined by
     * the distances between each joint and the center point.
     * When the model is not confident with the four torso joint predictions, the
     * function returns a default crop which is the full image padded to square.
     *
     * @param currentCropRegion The crop region that was used for the current frame.
     *     Can be null for the very first frame that is handled by the detector.
     * @param keypoints An array of `Keypoint`s associated with a person.
     * @param keypointIndexByName A map from keypoint name to index in the keypoints
     *     array.
     * @param imageSize The size of the image that is being processed.
     * @return A `BoundingBox` that contains the new crop region.
     */
    function determineNextCropRegion(currentCropRegion, keypoints, keypointIndexByName, imageSize) {
        var targetKeypoints = {};
        for (var _i = 0, COCO_KEYPOINTS_1 = COCO_KEYPOINTS; _i < COCO_KEYPOINTS_1.length; _i++) {
            var key = COCO_KEYPOINTS_1[_i];
            targetKeypoints[key] = [
                keypoints[keypointIndexByName[key]].y * imageSize.height,
                keypoints[keypointIndexByName[key]].x * imageSize.width
            ];
        }
        if (torsoVisible(keypoints, keypointIndexByName)) {
            var centerY = (targetKeypoints['left_hip'][0] + targetKeypoints['right_hip'][0]) / 2;
            var centerX = (targetKeypoints['left_hip'][1] + targetKeypoints['right_hip'][1]) / 2;
            var _a = determineTorsoAndBodyRange(keypoints, keypointIndexByName, targetKeypoints, centerY, centerX), maxTorsoYrange = _a[0], maxTorsoXrange = _a[1], maxBodyYrange = _a[2], maxBodyXrange = _a[3];
            var cropLengthHalf = Math.max(maxTorsoXrange * 1.9, maxTorsoYrange * 1.9, maxBodyYrange * 1.2, maxBodyXrange * 1.2);
            cropLengthHalf = Math.min(cropLengthHalf, Math.max(centerX, imageSize.width - centerX, centerY, imageSize.height - centerY));
            var cropCorner = [centerY - cropLengthHalf, centerX - cropLengthHalf];
            if (cropLengthHalf > Math.max(imageSize.width, imageSize.height) / 2) {
                return initCropRegion(currentCropRegion == null, imageSize);
            }
            else {
                var cropLength = cropLengthHalf * 2;
                return {
                    yMin: cropCorner[0] / imageSize.height,
                    xMin: cropCorner[1] / imageSize.width,
                    yMax: (cropCorner[0] + cropLength) / imageSize.height,
                    xMax: (cropCorner[1] + cropLength) / imageSize.width,
                    height: (cropCorner[0] + cropLength) / imageSize.height -
                        cropCorner[0] / imageSize.height,
                    width: (cropCorner[1] + cropLength) / imageSize.width -
                        cropCorner[1] / imageSize.width
                };
            }
        }
        else {
            return initCropRegion(currentCropRegion == null, imageSize);
        }
    }
    /**
     * Provides initial crop region.
     *
     * The function provides the initial crop region when the algorithm cannot
     * reliably determine the crop region from the previous frame. There are two
     * scenarios:
     *   1) The very first frame: the function returns the best guess by cropping
     *      a square in the middle of the image.
     *   2) Not enough reliable keypoints detected from the previous frame: the
     *      function pads the full image from both sides to make it a square
     *      image.
     *
     * @param firstFrame A boolean indicating whether we are initializing a crop
     *     region for the very first frame.
     * @param imageSize The size of the image that is being processed.
     * @return A `BoundingBox` that contains the initial crop region.
     */
    function initCropRegion(firstFrame, imageSize) {
        var boxHeight, boxWidth, yMin, xMin;
        if (firstFrame) {
            // If it is the first frame, perform a best guess by making the square
            // crop at the image center to better utilize the image pixels and
            // create higher chance to enter the cropping loop.
            if (imageSize.width > imageSize.height) {
                boxHeight = 1.0;
                boxWidth = imageSize.height / imageSize.width;
                yMin = 0.0;
                xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
            }
            else {
                boxHeight = imageSize.width / imageSize.height;
                boxWidth = 1.0;
                yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
                xMin = 0.0;
            }
        }
        else {
            // No cropRegion was available from a previous estimatePoses() call, so
            // run the model on the full image with padding on both sides.
            if (imageSize.width > imageSize.height) {
                boxHeight = imageSize.width / imageSize.height;
                boxWidth = 1.0;
                yMin = (imageSize.height / 2 - imageSize.width / 2) / imageSize.height;
                xMin = 0.0;
            }
            else {
                boxHeight = 1.0;
                boxWidth = imageSize.height / imageSize.width;
                yMin = 0.0;
                xMin = (imageSize.width / 2 - imageSize.height / 2) / imageSize.width;
            }
        }
        return {
            yMin: yMin,
            xMin: xMin,
            yMax: yMin + boxHeight,
            xMax: xMin + boxWidth,
            height: boxHeight,
            width: boxWidth
        };
    }

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
    function validateModelConfig$2(modelConfig) {
        var config = modelConfig == null ? MOVENET_CONFIG : __assign({}, modelConfig);
        if (config.modelType == null) {
            config.modelType = 'SinglePose.Lightning';
        }
        else if (VALID_MODELS.indexOf(config.modelType) < 0) {
            throw new Error("Invalid architecture " + config.modelType + ". " +
                ("Should be one of " + VALID_MODELS));
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
        if (config.modelType === MULTIPOSE_LIGHTNING &&
            config.enableTracking == null) {
            config.enableTracking = true;
        }
        if (config.modelType === MULTIPOSE_LIGHTNING &&
            config.enableTracking === true) {
            if (config.trackerType == null) {
                config.trackerType = exports.TrackerType.BoundingBox;
            }
            if (config.trackerType === exports.TrackerType.Keypoint) {
                if (config.trackerConfig != null) {
                    config.trackerConfig = mergeKeypointTrackerConfig(config.trackerConfig);
                }
                else {
                    config.trackerConfig = DEFAULT_KEYPOINT_TRACKER_CONFIG;
                }
            }
            else if (config.trackerType === exports.TrackerType.BoundingBox) {
                if (config.trackerConfig != null) {
                    config.trackerConfig =
                        mergeBoundingBoxTrackerConfig(config.trackerConfig);
                }
                else {
                    config.trackerConfig = DEFAULT_BOUNDING_BOX_TRACKER_CONFIG;
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
    function validateEstimationConfig$1(estimationConfig) {
        var config = estimationConfig == null ? MOVENET_ESTIMATION_CONFIG : __assign({}, estimationConfig);
        return config;
    }
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
        var mergedConfig = mergeBaseTrackerConfig(DEFAULT_KEYPOINT_TRACKER_CONFIG, userConfig);
        mergedConfig.keypointTrackerParams = __assign({}, DEFAULT_KEYPOINT_TRACKER_CONFIG.keypointTrackerParams);
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
    function mergeBoundingBoxTrackerConfig(userConfig) {
        var mergedConfig = mergeBaseTrackerConfig(DEFAULT_BOUNDING_BOX_TRACKER_CONFIG, userConfig);
        return mergedConfig;
    }

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
     * MoveNet detector class.
     */
    var MoveNetDetector = /** @class */ (function () {
        function MoveNetDetector(moveNetModel, config) {
            this.moveNetModel = moveNetModel;
            this.modelInputResolution = { height: 0, width: 0 };
            this.keypointIndexByName = getKeypointIndexByName(exports.SupportedModels.MoveNet);
            // Only single-pose models have a fixed input resolution.
            if (config.modelType === SINGLEPOSE_LIGHTNING) {
                this.modelInputResolution.width = MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
                this.modelInputResolution.height =
                    MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
            }
            else if (config.modelType === SINGLEPOSE_THUNDER) {
                this.modelInputResolution.width = MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
                this.modelInputResolution.height = MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
            }
            this.multiPoseModel = config.modelType === MULTIPOSE_LIGHTNING;
            if (!this.multiPoseModel) {
                this.keypointFilter = new KeypointsOneEuroFilter(KEYPOINT_FILTER_CONFIG);
                this.cropRegionFilterYMin = new LowPassFilter(CROP_FILTER_ALPHA);
                this.cropRegionFilterXMin = new LowPassFilter(CROP_FILTER_ALPHA);
                this.cropRegionFilterYMax = new LowPassFilter(CROP_FILTER_ALPHA);
                this.cropRegionFilterXMax = new LowPassFilter(CROP_FILTER_ALPHA);
            }
            this.enableSmoothing = config.enableSmoothing;
            if (config.minPoseScore) {
                this.minPoseScore = config.minPoseScore;
            }
            else {
                this.minPoseScore = DEFAULT_MIN_POSE_SCORE;
            }
            if (config.multiPoseMaxDimension) {
                this.multiPoseMaxDimension = config.multiPoseMaxDimension;
            }
            else {
                this.multiPoseMaxDimension = MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION;
            }
            this.enableTracking = config.enableTracking;
            if (this.multiPoseModel && this.enableTracking) {
                if (config.trackerType === exports.TrackerType.Keypoint) {
                    this.tracker = new KeypointTracker(config.trackerConfig);
                }
                else if (config.trackerType === exports.TrackerType.BoundingBox) {
                    this.tracker = new BoundingBoxTracker(config.trackerConfig);
                }
                if (this.enableSmoothing) {
                    this.keypointFilterMap = new Map();
                }
            }
        }
        /**
         * Runs inference on an image using a model that is assumed to be a single
         * person keypoint model that outputs 17 keypoints.
         *
         * @param inputImage 4D tensor containing the input image. Should be of size
         * [1, modelHeight, modelWidth, 3].
         * @return A `Pose`.
         */
        MoveNetDetector.prototype.runSinglePersonPoseModel = function (inputImage) {
            return __awaiter(this, void 0, void 0, function () {
                var outputTensor, inferenceResult, pose, numValidKeypoints, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outputTensor = this.moveNetModel.execute(inputImage);
                            // We expect an output tensor of shape [1, 1, 17, 3] (batch, person,
                            // keypoint, (y, x, score)).
                            if (outputTensor.shape.length !== 4 || outputTensor.shape[0] !== 1 ||
                                outputTensor.shape[1] !== 1 ||
                                outputTensor.shape[2] !== NUM_KEYPOINTS ||
                                outputTensor.shape[3] !== NUM_KEYPOINT_VALUES) {
                                outputTensor.dispose();
                                throw new Error("Unexpected output shape from model: [" + outputTensor.shape + "]");
                            }
                            if (!(tf.getBackend() !== 'webgpu')) return [3 /*break*/, 1];
                            inferenceResult = outputTensor.dataSync();
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, outputTensor.data()];
                        case 2:
                            inferenceResult = _a.sent();
                            _a.label = 3;
                        case 3:
                            outputTensor.dispose();
                            pose = { keypoints: [], score: 0.0 };
                            numValidKeypoints = 0;
                            for (i = 0; i < NUM_KEYPOINTS; ++i) {
                                pose.keypoints[i] = {
                                    y: inferenceResult[i * NUM_KEYPOINT_VALUES],
                                    x: inferenceResult[i * NUM_KEYPOINT_VALUES + 1],
                                    score: inferenceResult[i * NUM_KEYPOINT_VALUES + 2]
                                };
                                if (pose.keypoints[i].score > MIN_CROP_KEYPOINT_SCORE) {
                                    ++numValidKeypoints;
                                    pose.score += pose.keypoints[i].score;
                                }
                            }
                            if (numValidKeypoints > 0) {
                                pose.score /= numValidKeypoints;
                            }
                            return [2 /*return*/, pose];
                    }
                });
            });
        };
        /**
         * Runs inference on an image using a model that is assumed to be a
         * multi-person keypoint model that outputs 17 keypoints and a box for a
         * multiple persons.
         *
         * @param inputImage 4D tensor containing the input image. Should be of size
         * [1, width, height, 3], where width and height are divisible by 32.
         * @return An array of `Pose`s.
         */
        MoveNetDetector.prototype.runMultiPersonPoseModel = function (inputImage) {
            return __awaiter(this, void 0, void 0, function () {
                var outputTensor, inferenceResult, poses, numInstances, i, boxIndex, scoreIndex, j;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outputTensor = this.moveNetModel.execute(inputImage);
                            // Multi-pose model output is a [1, n, 56] tensor ([batch, num_instances,
                            // instance_keypoints_and_box]).
                            if (outputTensor.shape.length !== 3 || outputTensor.shape[0] !== 1 ||
                                outputTensor.shape[2] !== MULTIPOSE_INSTANCE_SIZE) {
                                outputTensor.dispose();
                                throw new Error("Unexpected output shape from model: [" + outputTensor.shape + "]");
                            }
                            if (!(tf.getBackend() !== 'webgpu')) return [3 /*break*/, 1];
                            inferenceResult = outputTensor.dataSync();
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, outputTensor.data()];
                        case 2:
                            inferenceResult = _a.sent();
                            _a.label = 3;
                        case 3:
                            outputTensor.dispose();
                            poses = [];
                            numInstances = inferenceResult.length / MULTIPOSE_INSTANCE_SIZE;
                            for (i = 0; i < numInstances; ++i) {
                                poses[i] = { keypoints: [] };
                                boxIndex = i * MULTIPOSE_INSTANCE_SIZE + MULTIPOSE_BOX_IDX;
                                poses[i].box = {
                                    yMin: inferenceResult[boxIndex],
                                    xMin: inferenceResult[boxIndex + 1],
                                    yMax: inferenceResult[boxIndex + 2],
                                    xMax: inferenceResult[boxIndex + 3],
                                    width: inferenceResult[boxIndex + 3] - inferenceResult[boxIndex + 1],
                                    height: inferenceResult[boxIndex + 2] - inferenceResult[boxIndex]
                                };
                                scoreIndex = i * MULTIPOSE_INSTANCE_SIZE + MULTIPOSE_BOX_SCORE_IDX;
                                poses[i].score = inferenceResult[scoreIndex];
                                poses[i].keypoints = [];
                                for (j = 0; j < NUM_KEYPOINTS; ++j) {
                                    poses[i].keypoints[j] = {
                                        y: inferenceResult[i * MULTIPOSE_INSTANCE_SIZE + j * NUM_KEYPOINT_VALUES],
                                        x: inferenceResult[i * MULTIPOSE_INSTANCE_SIZE + j * NUM_KEYPOINT_VALUES + 1],
                                        score: inferenceResult[i * MULTIPOSE_INSTANCE_SIZE + j * NUM_KEYPOINT_VALUES + 2]
                                    };
                                }
                            }
                            return [2 /*return*/, poses];
                    }
                });
            });
        };
        /**
         * Estimates poses for an image or video frame. This does standard ImageNet
         * pre-processing before inferring through the model. The image pixels should
         * have values [0-255]. It returns an array of poses.
         *
         * @param image ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
         * The input image to feed through the network.
         * @param config Optional. Currently not used.
         * @param timestamp Optional. In milliseconds. This is useful when image is
         * a tensor, which doesn't have timestamp info. Or to override timestamp in a
         * video.
         * @return An array of `Pose`s.
         */
        MoveNetDetector.prototype.estimatePoses = function (image, estimationConfig, timestamp) {
            if (estimationConfig === void 0) { estimationConfig = MOVENET_ESTIMATION_CONFIG; }
            return __awaiter(this, void 0, void 0, function () {
                var imageTensor3D, imageSize, imageTensor4D, poses, poseIdx, keypointIdx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            estimationConfig = validateEstimationConfig$1(estimationConfig);
                            if (image == null) {
                                this.reset();
                                return [2 /*return*/, []];
                            }
                            if (timestamp == null) {
                                if (isVideo(image)) {
                                    timestamp = image.currentTime * SECOND_TO_MICRO_SECONDS;
                                }
                            }
                            else {
                                timestamp = timestamp * MILLISECOND_TO_MICRO_SECONDS;
                            }
                            imageTensor3D = toImageTensor(image);
                            imageSize = getImageSize(imageTensor3D);
                            imageTensor4D = tf.expandDims(imageTensor3D, 0);
                            // Make sure we don't dispose the input image if it's already a tensor.
                            if (!(image instanceof tf.Tensor)) {
                                imageTensor3D.dispose();
                            }
                            poses = [];
                            if (!!this.multiPoseModel) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.estimateSinglePose(imageTensor4D, imageSize, timestamp)];
                        case 1:
                            poses =
                                _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.estimateMultiplePoses(imageTensor4D, imageSize, timestamp)];
                        case 3:
                            poses =
                                _a.sent();
                            _a.label = 4;
                        case 4:
                            // Convert keypoint coordinates from normalized coordinates to image space
                            // and add keypoint names.
                            for (poseIdx = 0; poseIdx < poses.length; ++poseIdx) {
                                for (keypointIdx = 0; keypointIdx < poses[poseIdx].keypoints.length; ++keypointIdx) {
                                    poses[poseIdx].keypoints[keypointIdx].name =
                                        COCO_KEYPOINTS[keypointIdx];
                                    poses[poseIdx].keypoints[keypointIdx].y *= imageSize.height;
                                    poses[poseIdx].keypoints[keypointIdx].x *= imageSize.width;
                                }
                            }
                            return [2 /*return*/, poses];
                    }
                });
            });
        };
        /**
         * Runs a single-person keypoint model on an image, including the image
         * cropping and keypoint filtering logic.
         *
         * @param imageTensor4D A tf.Tensor4D that contains the input image.
         * @param imageSize: The width and height of the input image.
         * @param timestamp Image timestamp in microseconds.
         * @return An array of `Pose`s.
         */
        MoveNetDetector.prototype.estimateSinglePose = function (imageTensor4D, imageSize, timestamp) {
            return __awaiter(this, void 0, void 0, function () {
                var croppedImage, pose, i, nextCropRegion;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.cropRegion) {
                                this.cropRegion = initCropRegion(this.cropRegion == null, imageSize);
                            }
                            croppedImage = tf.tidy(function () {
                                // Crop region is a [batch, 4] size tensor.
                                var cropRegionTensor = tf.tensor2d([[
                                        _this.cropRegion.yMin, _this.cropRegion.xMin, _this.cropRegion.yMax,
                                        _this.cropRegion.xMax
                                    ]]);
                                // The batch index that the crop should operate on. A [batch] size
                                // tensor.
                                var boxInd = tf.zeros([1], 'int32');
                                // Target size of each crop.
                                var cropSize = [_this.modelInputResolution.height, _this.modelInputResolution.width];
                                return tf.cast(tf.image.cropAndResize(imageTensor4D, cropRegionTensor, boxInd, cropSize, 'bilinear', 0), 'int32');
                            });
                            imageTensor4D.dispose();
                            return [4 /*yield*/, this.runSinglePersonPoseModel(croppedImage)];
                        case 1:
                            pose = _a.sent();
                            croppedImage.dispose();
                            if (pose.score < this.minPoseScore) {
                                this.reset();
                                return [2 /*return*/, []];
                            }
                            // Convert keypoints from crop coordinates to image coordinates.
                            for (i = 0; i < pose.keypoints.length; ++i) {
                                pose.keypoints[i].y =
                                    this.cropRegion.yMin + pose.keypoints[i].y * this.cropRegion.height;
                                pose.keypoints[i].x =
                                    this.cropRegion.xMin + pose.keypoints[i].x * this.cropRegion.width;
                            }
                            // Apply the sequential filter before estimating the cropping area to make
                            // it more stable.
                            if (timestamp != null && this.enableSmoothing) {
                                pose.keypoints = this.keypointFilter.apply(pose.keypoints, timestamp, 1 /* objectScale */);
                            }
                            nextCropRegion = determineNextCropRegion(this.cropRegion, pose.keypoints, this.keypointIndexByName, imageSize);
                            this.cropRegion = this.filterCropRegion(nextCropRegion);
                            return [2 /*return*/, [pose]];
                    }
                });
            });
        };
        /**
         * Runs a multi-person keypoint model on an image, including image
         * preprocessing.
         *
         * @param imageTensor4D A tf.Tensor4D that contains the input image.
         * @param imageSize: The width and height of the input image.
         * @param timestamp Image timestamp in microseconds.
         * @return An array of `Pose`s.
         */
        MoveNetDetector.prototype.estimateMultiplePoses = function (imageTensor4D, imageSize, timestamp) {
            return __awaiter(this, void 0, void 0, function () {
                var resizedImage, resizedWidth, resizedHeight, paddedImage, paddedWidth, paddedHeight, dimensionDivisor, paddedImageInt32, poses, i, j, i, trackIDs_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dimensionDivisor = 32;
                            if (imageSize.width > imageSize.height) {
                                resizedWidth = this.multiPoseMaxDimension;
                                resizedHeight = Math.round(this.multiPoseMaxDimension * imageSize.height / imageSize.width);
                                resizedImage =
                                    tf.image.resizeBilinear(imageTensor4D, [resizedHeight, resizedWidth]);
                                paddedWidth = resizedWidth;
                                paddedHeight =
                                    Math.ceil(resizedHeight / dimensionDivisor) * dimensionDivisor;
                                paddedImage = tf.pad(resizedImage, [[0, 0], [0, paddedHeight - resizedHeight], [0, 0], [0, 0]]);
                            }
                            else {
                                resizedWidth = Math.round(this.multiPoseMaxDimension * imageSize.width / imageSize.height);
                                resizedHeight = this.multiPoseMaxDimension;
                                resizedImage =
                                    tf.image.resizeBilinear(imageTensor4D, [resizedHeight, resizedWidth]);
                                paddedWidth =
                                    Math.ceil(resizedWidth / dimensionDivisor) * dimensionDivisor;
                                paddedHeight = resizedHeight;
                                paddedImage = tf.pad(resizedImage, [[0, 0], [0, 0], [0, paddedWidth - resizedWidth], [0, 0]]);
                            }
                            resizedImage.dispose();
                            imageTensor4D.dispose();
                            paddedImageInt32 = tf.cast(paddedImage, 'int32');
                            paddedImage.dispose();
                            return [4 /*yield*/, this.runMultiPersonPoseModel(paddedImageInt32)];
                        case 1:
                            poses = _a.sent();
                            paddedImageInt32.dispose();
                            poses = poses.filter(function (pose) { return pose.score >= _this.minPoseScore; });
                            // Convert keypoints from padded coordinates to normalized coordinates.
                            for (i = 0; i < poses.length; ++i) {
                                for (j = 0; j < poses[i].keypoints.length; ++j) {
                                    poses[i].keypoints[j].y *= paddedHeight / resizedHeight;
                                    poses[i].keypoints[j].x *= paddedWidth / resizedWidth;
                                }
                            }
                            if (this.enableTracking) {
                                this.tracker.apply(poses, timestamp);
                                if (this.enableSmoothing) {
                                    for (i = 0; i < poses.length; ++i) {
                                        if (!this.keypointFilterMap.has(poses[i].id)) {
                                            this.keypointFilterMap.set(poses[i].id, new KeypointsOneEuroFilter(KEYPOINT_FILTER_CONFIG));
                                        }
                                        poses[i].keypoints =
                                            this.keypointFilterMap.get(poses[i].id)
                                                .apply(poses[i].keypoints, timestamp, 1 /* objectScale */);
                                    }
                                    trackIDs_1 = this.tracker.getTrackIDs();
                                    this.keypointFilterMap.forEach(function (_, trackID) {
                                        if (!trackIDs_1.has(trackID)) {
                                            _this.keypointFilterMap.delete(trackID);
                                        }
                                    });
                                }
                            }
                            return [2 /*return*/, poses];
                    }
                });
            });
        };
        MoveNetDetector.prototype.filterCropRegion = function (newCropRegion) {
            if (!newCropRegion) {
                this.cropRegionFilterYMin.reset();
                this.cropRegionFilterXMin.reset();
                this.cropRegionFilterYMax.reset();
                this.cropRegionFilterXMax.reset();
                return null;
            }
            else {
                var filteredYMin = this.cropRegionFilterYMin.apply(newCropRegion.yMin);
                var filteredXMin = this.cropRegionFilterXMin.apply(newCropRegion.xMin);
                var filteredYMax = this.cropRegionFilterYMax.apply(newCropRegion.yMax);
                var filteredXMax = this.cropRegionFilterXMax.apply(newCropRegion.xMax);
                return {
                    yMin: filteredYMin,
                    xMin: filteredXMin,
                    yMax: filteredYMax,
                    xMax: filteredXMax,
                    height: filteredYMax - filteredYMin,
                    width: filteredXMax - filteredXMin
                };
            }
        };
        MoveNetDetector.prototype.dispose = function () {
            this.moveNetModel.dispose();
        };
        MoveNetDetector.prototype.reset = function () {
            this.cropRegion = null;
            this.resetFilters();
        };
        MoveNetDetector.prototype.resetFilters = function () {
            this.keypointFilter.reset();
            this.cropRegionFilterYMin.reset();
            this.cropRegionFilterXMin.reset();
            this.cropRegionFilterYMax.reset();
            this.cropRegionFilterXMax.reset();
        };
        return MoveNetDetector;
    }());
    /**
     * Loads the MoveNet model instance from a checkpoint. The model to be loaded
     * is configurable using the config dictionary `ModelConfig`. Please find more
     * details in the documentation of the `ModelConfig`.
     *
     * @param config `ModelConfig` dictionary that contains parameters for
     * the MoveNet loading process. Please find more details of each parameter
     * in the documentation of the `ModelConfig` interface.
     */
    function load$2(modelConfig) {
        if (modelConfig === void 0) { modelConfig = MOVENET_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            var config, model, fromTFHub, modelUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = validateModelConfig$2(modelConfig);
                        fromTFHub = true;
                        if (!!!config.modelUrl) return [3 /*break*/, 2];
                        fromTFHub = typeof config.modelUrl === 'string' &&
                            config.modelUrl.indexOf('https://tfhub.dev') > -1;
                        return [4 /*yield*/, tfconv.loadGraphModel(config.modelUrl, { fromTFHub: fromTFHub })];
                    case 1:
                        model = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        modelUrl = void 0;
                        if (config.modelType === SINGLEPOSE_LIGHTNING) {
                            modelUrl = MOVENET_SINGLEPOSE_LIGHTNING_URL;
                        }
                        else if (config.modelType === SINGLEPOSE_THUNDER) {
                            modelUrl = MOVENET_SINGLEPOSE_THUNDER_URL;
                        }
                        else if (config.modelType === MULTIPOSE_LIGHTNING) {
                            modelUrl = MOVENET_MULTIPOSE_LIGHTNING_URL;
                        }
                        return [4 /*yield*/, tfconv.loadGraphModel(modelUrl, { fromTFHub: fromTFHub })];
                    case 3:
                        model = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (tf.getBackend() === 'webgl') {
                            // MoveNet has a top-k op that runs faster on GPU for the size of our last
                            // dimension (6400). There are three checks that could make the top-k op run
                            // on CPU (see
                            // https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-webgl/src/kernels/TopK.ts)
                            //
                            // 1. All input shapes < 128
                            // 2. lastDim < TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD
                            // 3. k > TOPK_K_CPU_HANDOFF_THRESHOLD
                            //
                            // In our case, setting TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD = 0 will
                            // will disable the CPU forwarding.
                            tf.env().set('TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD', 0);
                        }
                        return [2 /*return*/, new MoveNetDetector(model, config)];
                }
            });
        });
    }

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
    // The default configuration for loading MobileNetV1 based PoseNet.
    //
    // (And for references, the default configuration for loading ResNet
    // based PoseNet is also included).
    //
    // ```
    // const RESNET_CONFIG = {
    //   architecture: 'ResNet50',
    //   outputStride: 32,
    //   quantBytes: 2,
    // } as ModelConfig;
    // ```
    var MOBILENET_V1_CONFIG = {
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        inputResolution: { height: 257, width: 257 }
    };
    var VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
    var VALID_STRIDE = {
        'MobileNetV1': [8, 16],
        'ResNet50': [16]
    };
    var VALID_OUTPUT_STRIDES = [8, 16, 32];
    var VALID_MULTIPLIER = {
        'MobileNetV1': [0.50, 0.75, 1.0],
        'ResNet50': [1.0]
    };
    var VALID_QUANT_BYTES = [1, 2, 4];
    var SINGLE_PERSON_ESTIMATION_CONFIG = {
        maxPoses: 1,
        flipHorizontal: false
    };
    var MULTI_PERSON_ESTIMATION_CONFIG = {
        maxPoses: 5,
        flipHorizontal: false,
        scoreThreshold: 0.5,
        nmsRadius: 20
    };
    var RESNET_MEAN = [-123.15, -115.90, -103.06];
    // A point (y, x) is considered as root part candidate if its score is a
    // maximum in a window |y - y'| <= kLocalMaximumRadius, |x - x'| <=
    // kLocalMaximumRadius.
    var K_LOCAL_MAXIMUM_RADIUS = 1;
    var NUM_KEYPOINTS$1 = 17;
    /*
     * Define the skeleton. This defines the parent->child relationships of our
     * tree. Arbitrarily this defines the nose as the root of the tree, however
     * since we will infer the displacement for both parent->child and
     * child->parent, we can define the tree root as any node.
     */
    var POSE_CHAIN = [
        ['nose', 'left_eye'], ['left_eye', 'left_ear'], ['nose', 'right_eye'],
        ['right_eye', 'right_ear'], ['nose', 'left_shoulder'],
        ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
        ['left_shoulder', 'left_hip'], ['left_hip', 'left_knee'],
        ['left_knee', 'left_ankle'], ['nose', 'right_shoulder'],
        ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
        ['right_shoulder', 'right_hip'], ['right_hip', 'right_knee'],
        ['right_knee', 'right_ankle']
    ];

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
    // algorithm based on Coursera Lecture from Algorithms, Part 1:
    // https://www.coursera.org/learn/algorithms-part1/lecture/ZjoSM/heapsort
    function half(k) {
        return Math.floor(k / 2);
    }
    var MaxHeap = /** @class */ (function () {
        function MaxHeap(maxSize, getElementValue) {
            this.priorityQueue = new Array(maxSize);
            this.numberOfElements = -1;
            this.getElementValue = getElementValue;
        }
        MaxHeap.prototype.enqueue = function (x) {
            this.priorityQueue[++this.numberOfElements] = x;
            this.swim(this.numberOfElements);
        };
        MaxHeap.prototype.dequeue = function () {
            var max = this.priorityQueue[0];
            this.exchange(0, this.numberOfElements--);
            this.sink(0);
            this.priorityQueue[this.numberOfElements + 1] = null;
            return max;
        };
        MaxHeap.prototype.empty = function () {
            return this.numberOfElements === -1;
        };
        MaxHeap.prototype.size = function () {
            return this.numberOfElements + 1;
        };
        MaxHeap.prototype.all = function () {
            return this.priorityQueue.slice(0, this.numberOfElements + 1);
        };
        MaxHeap.prototype.max = function () {
            return this.priorityQueue[0];
        };
        MaxHeap.prototype.swim = function (k) {
            while (k > 0 && this.less(half(k), k)) {
                this.exchange(k, half(k));
                k = half(k);
            }
        };
        MaxHeap.prototype.sink = function (k) {
            while (2 * k <= this.numberOfElements) {
                var j = 2 * k;
                if (j < this.numberOfElements && this.less(j, j + 1)) {
                    j++;
                }
                if (!this.less(k, j)) {
                    break;
                }
                this.exchange(k, j);
                k = j;
            }
        };
        MaxHeap.prototype.getValueAt = function (i) {
            return this.getElementValue(this.priorityQueue[i]);
        };
        MaxHeap.prototype.less = function (i, j) {
            return this.getValueAt(i) < this.getValueAt(j);
        };
        MaxHeap.prototype.exchange = function (i, j) {
            var t = this.priorityQueue[i];
            this.priorityQueue[i] = this.priorityQueue[j];
            this.priorityQueue[j] = t;
        };
        return MaxHeap;
    }());

    function scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores) {
        var _a = scores.shape, height = _a[0], width = _a[1];
        var localMaximum = true;
        var yStart = Math.max(heatmapY - localMaximumRadius, 0);
        var yEnd = Math.min(heatmapY + localMaximumRadius + 1, height);
        for (var yCurrent = yStart; yCurrent < yEnd; ++yCurrent) {
            var xStart = Math.max(heatmapX - localMaximumRadius, 0);
            var xEnd = Math.min(heatmapX + localMaximumRadius + 1, width);
            for (var xCurrent = xStart; xCurrent < xEnd; ++xCurrent) {
                if (scores.get(yCurrent, xCurrent, keypointId) > score) {
                    localMaximum = false;
                    break;
                }
            }
            if (!localMaximum) {
                break;
            }
        }
        return localMaximum;
    }
    /**
     * Builds a priority queue with part candidate positions for a specific image in
     * the batch. For this we find all local maxima in the score maps with score
     * values above a threshold. We create a single priority queue across all parts.
     */
    function buildPartWithScoreQueue(scoreThreshold, localMaximumRadius, scores) {
        var _a = scores.shape, height = _a[0], width = _a[1], numKeypoints = _a[2];
        var queue = new MaxHeap(height * width * numKeypoints, function (_a) {
            var score = _a.score;
            return score;
        });
        for (var heatmapY = 0; heatmapY < height; ++heatmapY) {
            for (var heatmapX = 0; heatmapX < width; ++heatmapX) {
                for (var keypointId = 0; keypointId < numKeypoints; ++keypointId) {
                    var score = scores.get(heatmapY, heatmapX, keypointId);
                    // Only consider parts with score greater or equal to threshold as
                    // root candidates.
                    if (score < scoreThreshold) {
                        continue;
                    }
                    // Only consider keypoints whose score is maximum in a local window.
                    if (scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores)) {
                        queue.enqueue({ score: score, part: { heatmapY: heatmapY, heatmapX: heatmapX, id: keypointId } });
                    }
                }
            }
        }
        return queue;
    }

    function toTensorBuffers3D(tensors) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(tensors.map(function (tensor) { return tensor.buffer(); }))];
            });
        });
    }
    function getOffsetPoint(y, x, keypoint, offsets) {
        return {
            y: offsets.get(y, x, keypoint),
            x: offsets.get(y, x, keypoint + NUM_KEYPOINTS$1)
        };
    }
    function getImageCoords(part, outputStride, offsets) {
        var heatmapY = part.heatmapY, heatmapX = part.heatmapX, keypoint = part.id;
        var _a = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets), y = _a.y, x = _a.x;
        return {
            x: part.heatmapX * outputStride + x,
            y: part.heatmapY * outputStride + y
        };
    }
    function squaredDistance(y1, x1, y2, x2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        return dy * dy + dx * dx;
    }
    function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, _a, keypointId) {
        var x = _a.x, y = _a.y;
        return poses.some(function (_a) {
            var keypoints = _a.keypoints;
            return squaredDistance(y, x, keypoints[keypointId].y, keypoints[keypointId].x) <=
                squaredNmsRadius;
        });
    }
    var partIds = 
    // tslint:disable-next-line: no-unnecessary-type-assertion
    COCO_KEYPOINTS.reduce(function (result, jointName, i) {
        result[jointName] = i;
        return result;
    }, {});
    var parentChildrenTuples = POSE_CHAIN.map(function (_a) {
        var parentJoinName = _a[0], childJoinName = _a[1];
        return ([partIds[parentJoinName], partIds[childJoinName]]);
    });
    var parentToChildEdges = parentChildrenTuples.map(function (_a) {
        var childJointId = _a[1];
        return childJointId;
    });
    var childToParentEdges = parentChildrenTuples.map(function (_a) {
        var parentJointId = _a[0];
        return parentJointId;
    });
    function clamp(a, min, max) {
        if (a < min) {
            return min;
        }
        if (a > max) {
            return max;
        }
        return a;
    }
    function getStridedIndexNearPoint(point, outputStride, height, width) {
        return {
            y: clamp(Math.round(point.y / outputStride), 0, height - 1),
            x: clamp(Math.round(point.x / outputStride), 0, width - 1)
        };
    }
    function getDisplacement(edgeId, point, displacements) {
        var numEdges = displacements.shape[2] / 2;
        return {
            y: displacements.get(point.y, point.x, edgeId),
            x: displacements.get(point.y, point.x, numEdges + edgeId)
        };
    }
    function addVectors(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    /**
     * We get a new keypoint along the `edgeId` for the pose instance, assuming
     * that the position of the `idSource` part is already known. For this, we
     * follow the displacement vector from the source to target part (stored in
     * the `i`-t channel of the displacement tensor). The displaced keypoint
     * vector is refined using the offset vector by `offsetRefineStep` times.
     */
    function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep) {
        if (offsetRefineStep === void 0) { offsetRefineStep = 2; }
        var _a = scoresBuffer.shape, height = _a[0], width = _a[1];
        var point = { y: sourceKeypoint.y, x: sourceKeypoint.x };
        // Nearest neighbor interpolation for the source->target displacements.
        var sourceKeypointIndices = getStridedIndexNearPoint(point, outputStride, height, width);
        var displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
        var displacedPoint = addVectors(point, displacement);
        var targetKeypoint = displacedPoint;
        for (var i = 0; i < offsetRefineStep; i++) {
            var targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
            var offsetPoint = getOffsetPoint(targetKeypointIndices.y, targetKeypointIndices.x, targetKeypointId, offsets);
            targetKeypoint = addVectors({
                x: targetKeypointIndices.x * outputStride,
                y: targetKeypointIndices.y * outputStride
            }, { x: offsetPoint.x, y: offsetPoint.y });
        }
        var targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
        var score = scoresBuffer.get(targetKeyPointIndices.y, targetKeyPointIndices.x, targetKeypointId);
        return {
            y: targetKeypoint.y,
            x: targetKeypoint.x,
            name: COCO_KEYPOINTS[targetKeypointId],
            score: score
        };
    }
    /**
     * Follows the displacement fields to decode the full pose of the object
     * instance given the position of a part that acts as root.
     *
     * @return An array of decoded keypoints and their scores for a single pose
     */
    function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
        var numParts = scores.shape[2];
        var numEdges = parentToChildEdges.length;
        var instanceKeypoints = new Array(numParts);
        // Start a new detection instance at the position of the root.
        var rootPart = root.part, rootScore = root.score;
        var rootPoint = getImageCoords(rootPart, outputStride, offsets);
        instanceKeypoints[rootPart.id] = {
            score: rootScore,
            name: COCO_KEYPOINTS[rootPart.id],
            y: rootPoint.y,
            x: rootPoint.x
        };
        // Decode the part positions upwards in the tree, following the backward
        // displacements.
        for (var edge = numEdges - 1; edge >= 0; --edge) {
            var sourceKeypointId = parentToChildEdges[edge];
            var targetKeypointId = childToParentEdges[edge];
            if (instanceKeypoints[sourceKeypointId] &&
                !instanceKeypoints[targetKeypointId]) {
                instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsBwd);
            }
        }
        // Decode the part positions downwards in the tree, following the forward
        // displacements.
        for (var edge = 0; edge < numEdges; ++edge) {
            var sourceKeypointId = childToParentEdges[edge];
            var targetKeypointId = parentToChildEdges[edge];
            if (instanceKeypoints[sourceKeypointId] &&
                !instanceKeypoints[targetKeypointId]) {
                instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsFwd);
            }
        }
        return instanceKeypoints;
    }
    /* Score the newly proposed object instance without taking into account
     * the scores of the parts that overlap with any previously detected
     * instance.
     */
    function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
        var notOverlappedKeypointScores = instanceKeypoints.reduce(function (result, _a, keypointId) {
            var y = _a.y, x = _a.x, score = _a.score;
            if (!withinNmsRadiusOfCorrespondingPoint(existingPoses, squaredNmsRadius, { y: y, x: x }, keypointId)) {
                result += score;
            }
            return result;
        }, 0.0);
        return notOverlappedKeypointScores /= instanceKeypoints.length;
    }

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
    /**
     * Detects multiple poses and finds their parts from part scores and
     * displacement vectors. It returns up to `maxDetections` object instance
     * detections in decreasing root score order. It works as follows: We first
     * create a priority queue with local part score maxima above
     * `scoreThreshold`, considering all parts at the same time. Then we
     * iteratively pull the top  element of the queue (in decreasing score order)
     * and treat it as a root candidate for a new object instance. To avoid
     * duplicate detections, we reject the root candidate if it is within a disk
     * of `nmsRadius` pixels from the corresponding part of a previously detected
     * instance, which is a form of part-based non-maximum suppression (NMS). If
     * the root candidate passes the NMS check, we start a new object instance
     * detection, treating the corresponding part as root and finding the
     * positions of the remaining parts by following the displacement vectors
     * along the tree-structured part graph. We assign to the newly detected
     * instance a score equal to the sum of scores of its parts which have not
     * been claimed by a previous instance (i.e., those at least `nmsRadius`
     * pixels away from the corresponding part of all previously detected
     * instances), divided by the total number of parts `numParts`.
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
     * @param displacementsFwd 3-D tensor of shape
     * `[height, width, 2 * num_edges]`, where `num_edges = num_parts - 1` is the
     * number of edges (parent-child pairs) in the tree. It contains the forward
     * displacements between consecutive part from the root towards the leaves.
     *
     * @param displacementsBwd 3-D tensor of shape
     * `[height, width, 2 * num_edges]`, where `num_edges = num_parts - 1` is the
     * number of edges (parent-child pairs) in the tree. It contains the backward
     * displacements between consecutive part from the root towards the leaves.
     *
     * @param outputStride The output stride that was used when feed-forwarding
     * through the PoseNet model.  Must be 32, 16, or 8.
     *
     * @param maxPoseDetections Maximum number of returned instance detections per
     * image.
     *
     * @param scoreThreshold Only return instance detections that have root part
     * score greater or equal to this value. Defaults to 0.5.
     *
     * @param nmsRadius Non-maximum suppression part distance. It needs to be
     * strictly positive. Two parts suppress each other if they are less than
     * `nmsRadius` pixels away. Defaults to 20.
     *
     * @return An array of poses and their scores, each containing keypoints and
     * the corresponding keypoint scores.
     */
    function decodeMultiplePoses(heatmapScores, offsets, displacementFwd, displacementBwd, outputStride, maxPoseDetections, scoreThreshold, nmsRadius) {
        if (scoreThreshold === void 0) { scoreThreshold = 0.5; }
        if (nmsRadius === void 0) { nmsRadius = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, poses, queue, squaredNmsRadius, root, rootImageCoords, keypoints, score;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, toTensorBuffers3D([heatmapScores, offsets, displacementFwd, displacementBwd])];
                    case 1:
                        _a = _b.sent(), scoresBuffer = _a[0], offsetsBuffer = _a[1], displacementsFwdBuffer = _a[2], displacementsBwdBuffer = _a[3];
                        poses = [];
                        queue = buildPartWithScoreQueue(scoreThreshold, K_LOCAL_MAXIMUM_RADIUS, scoresBuffer);
                        squaredNmsRadius = nmsRadius * nmsRadius;
                        // Generate at most maxDetections object instances per image in
                        // decreasing root part score order.
                        while (poses.length < maxPoseDetections && !queue.empty()) {
                            root = queue.dequeue();
                            rootImageCoords = getImageCoords(root.part, outputStride, offsetsBuffer);
                            if (withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, rootImageCoords, root.part.id)) {
                                continue;
                            }
                            keypoints = decodePose(root, scoresBuffer, offsetsBuffer, outputStride, displacementsFwdBuffer, displacementsBwdBuffer);
                            score = getInstanceScore(poses, squaredNmsRadius, keypoints);
                            poses.push({ keypoints: keypoints, score: score });
                        }
                        return [2 /*return*/, poses];
                }
            });
        });
    }

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
    function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
        return tf.tidy(function () {
            var offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
            return tf.add(tf.cast(tf.mul(heatMapCoordsBuffer.toTensor(), tf.scalar(outputStride, 'int32')), 'float32'), offsetVectors);
        });
    }
    function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
        var result = [];
        for (var keypoint = 0; keypoint < COCO_KEYPOINTS.length; keypoint++) {
            var heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
            var heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
            var _a = getOffsetPoint$1(heatmapY, heatmapX, keypoint, offsetsBuffer), x = _a.x, y = _a.y;
            result.push(y);
            result.push(x);
        }
        return tf.tensor2d(result, [COCO_KEYPOINTS.length, 2]);
    }
    function getOffsetPoint$1(y, x, keypoint, offsetsBuffer) {
        return {
            y: offsetsBuffer.get(y, x, keypoint),
            x: offsetsBuffer.get(y, x, keypoint + COCO_KEYPOINTS.length)
        };
    }

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
                        heatmapValues = argmax2d(heatmapScores);
                        return [4 /*yield*/, Promise.all([heatmapScores.buffer(), offsets.buffer(), heatmapValues.buffer()])];
                    case 1:
                        allTensorBuffers = _a.sent();
                        scoresBuffer = allTensorBuffers[0];
                        offsetsBuffer = allTensorBuffers[1];
                        heatmapValuesBuffer = allTensorBuffers[2];
                        offsetPoints = getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
                        return [4 /*yield*/, offsetPoints.buffer()];
                    case 2:
                        offsetPointsBuffer = _a.sent();
                        keypointConfidence = Array.from(getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
                        keypoints = keypointConfidence.map(function (score, keypointId) {
                            totalScore += score;
                            return {
                                y: offsetPointsBuffer.get(keypointId, 0),
                                x: offsetPointsBuffer.get(keypointId, 1),
                                score: score,
                                name: COCO_KEYPOINTS[keypointId]
                            };
                        });
                        heatmapValues.dispose();
                        offsetPoints.dispose();
                        return [2 /*return*/, { keypoints: keypoints, score: totalScore / keypoints.length }];
                }
            });
        });
    }

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
    function flipPosesHorizontal(poses, imageSize) {
        for (var _i = 0, poses_1 = poses; _i < poses_1.length; _i++) {
            var pose = poses_1[_i];
            for (var _a = 0, _b = pose.keypoints; _a < _b.length; _a++) {
                var kp = _b[_a];
                kp.x = imageSize.width - 1 - kp.x;
            }
        }
        return poses;
    }

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
    function scalePoses(poses, imageSize, inputResolution, padding) {
        var height = imageSize.height, width = imageSize.width;
        var scaleY = height / (inputResolution.height * (1 - padding.top - padding.bottom));
        var scaleX = width / (inputResolution.width * (1 - padding.left - padding.right));
        var offsetY = -padding.top * inputResolution.height;
        var offsetX = -padding.left * inputResolution.width;
        if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
            return poses;
        }
        for (var _i = 0, poses_1 = poses; _i < poses_1.length; _i++) {
            var pose = poses_1[_i];
            for (var _a = 0, _b = pose.keypoints; _a < _b.length; _a++) {
                var kp = _b[_a];
                kp.x = (kp.x + offsetX) * scaleX;
                kp.y = (kp.y + offsetY) * scaleY;
            }
        }
        return poses;
    }

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
    function validateModelConfig$3(modelConfig) {
        var config = modelConfig || MOBILENET_V1_CONFIG;
        if (config.architecture == null) {
            config.architecture = 'MobileNetV1';
        }
        if (VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
            throw new Error("Invalid architecture " + config.architecture + ". " +
                ("Should be one of " + VALID_ARCHITECTURE));
        }
        if (config.inputResolution == null) {
            config.inputResolution = { height: 257, width: 257 };
        }
        if (config.outputStride == null) {
            config.outputStride = 16;
        }
        if (VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
            throw new Error("Invalid outputStride " + config.outputStride + ". " +
                ("Should be one of " + VALID_STRIDE[config.architecture] + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.multiplier == null) {
            config.multiplier = 1.0;
        }
        if (VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
            throw new Error("Invalid multiplier " + config.multiplier + ". " +
                ("Should be one of " + VALID_MULTIPLIER[config.architecture] + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.quantBytes == null) {
            config.quantBytes = 4;
        }
        if (VALID_QUANT_BYTES.indexOf(config.quantBytes) < 0) {
            throw new Error("Invalid quantBytes " + config.quantBytes + ". " +
                ("Should be one of " + VALID_QUANT_BYTES + " ") +
                ("for architecture " + config.architecture + "."));
        }
        if (config.architecture === 'MobileNetV1' && config.outputStride === 32 &&
            config.multiplier !== 1) {
            throw new Error("When using an output stride of 32, " +
                "you must select 1 as the multiplier.");
        }
        return config;
    }
    function assertValidOutputStride(outputStride) {
        tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, function () { return "outputStride of " + outputStride + " is invalid. " +
            "It must be either 8 or 16."; });
    }
    function isValidInputResolution(resolution, outputStride) {
        return (resolution - 1) % outputStride === 0;
    }
    function assertValidResolution(resolution, outputStride) {
        tf.util.assert(isValidInputResolution(resolution.height, outputStride), function () { return "height of " + resolution.height + " is invalid for output stride " +
            (outputStride + "."); });
        tf.util.assert(isValidInputResolution(resolution.width, outputStride), function () { return "width of " + resolution.width + " is invalid for output stride " +
            (outputStride + "."); });
    }
    function validateEstimationConfig$2(estimationConfig) {
        var config = estimationConfig;
        if (config.maxPoses == null) {
            config.maxPoses = 1;
        }
        if (config.maxPoses <= 0) {
            throw new Error("Invalid maxPoses " + config.maxPoses + ". Should be > 0.");
        }
        if (config.maxPoses > 1) {
            // Multi-poses estimation, needs additional check for multi-poses
            // parameters.
            config = __assign(__assign({}, MULTI_PERSON_ESTIMATION_CONFIG), config);
            if (config.scoreThreshold < 0.0 || config.scoreThreshold > 1.0) {
                throw new Error("Invalid scoreThreshold " + config.scoreThreshold + ". " +
                    "Should be in range [0.0, 1.0]");
            }
            if (config.nmsRadius <= 0) {
                throw new Error("Invalid nmsRadius " + config.nmsRadius + ".");
            }
        }
        return config;
    }

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
    var MOBILENET_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/';
    var RESNET50_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/';
    // The PoseNet 2.0 ResNet50 models use the latest TensorFlow.js 1.0 model
    // format.
    function resNet50Checkpoint(stride, quantBytes) {
        var graphJson = "model-stride" + stride + ".json";
        // quantBytes=4 corresponding to the non-quantized full-precision checkpoints.
        if (quantBytes === 4) {
            return RESNET50_BASE_URL + "float/" + graphJson;
        }
        else {
            return RESNET50_BASE_URL + ("quant" + quantBytes + "/") + graphJson;
        }
    }
    // The PoseNet 2.0 MobileNetV1 models use the latest TensorFlow.js 1.0 model
    // format.
    function mobileNetCheckpoint(stride, multiplier, quantBytes) {
        var toStr = { 1.0: '100', 0.75: '075', 0.50: '050' };
        var graphJson = "model-stride" + stride + ".json";
        // quantBytes=4 corresponding to the non-quantized full-precision checkpoints.
        if (quantBytes === 4) {
            return MOBILENET_BASE_URL + ("float/" + toStr[multiplier] + "/") + graphJson;
        }
        else {
            return MOBILENET_BASE_URL + ("quant" + quantBytes + "/" + toStr[multiplier] + "/") +
                graphJson;
        }
    }
    function getValidInputResolutionDimensions(inputResolution, outputStride) {
        return {
            height: toValidInputResolution(inputResolution.height, outputStride),
            width: toValidInputResolution(inputResolution.width, outputStride)
        };
    }
    function toValidInputResolution(inputResolution, outputStride) {
        if (isValidInputResolution$1(inputResolution, outputStride)) {
            return inputResolution;
        }
        return Math.floor(inputResolution / outputStride) * outputStride + 1;
    }
    function isValidInputResolution$1(resolution, outputStride) {
        return (resolution - 1) % outputStride === 0;
    }

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
     * PoseNet detector class.
     */
    var PosenetDetector = /** @class */ (function () {
        function PosenetDetector(posenetModel, config) {
            this.posenetModel = posenetModel;
            // validate params.
            var inputShape = this.posenetModel.inputs[0].shape;
            tf.util.assert((inputShape[1] === -1) && (inputShape[2] === -1), function () { return "Input shape [" + inputShape[1] + ", " + inputShape[2] + "] " +
                "must both be equal to or -1"; });
            var validInputResolution = getValidInputResolutionDimensions(config.inputResolution, config.outputStride);
            assertValidOutputStride(config.outputStride);
            assertValidResolution(validInputResolution, config.outputStride);
            this.inputResolution = validInputResolution;
            this.outputStride = config.outputStride;
            this.architecture = config.architecture;
        }
        /**
         * Estimates poses for an image or video frame.
         *
         * This does standard ImageNet pre-processing before inferring through the
         * model. The image should pixels should have values [0-255]. It returns a
         * single pose or multiple poses based on the maxPose parameter from the
         * `config`.
         *
         * @param image
         * ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement The input
         * image to feed through the network.
         *
         * @param config
         *       maxPoses: Optional. Max number of poses to estimate.
         *       When maxPoses = 1, a single pose is detected, it is usually much more
         *       efficient than maxPoses > 1. When maxPoses > 1, multiple poses are
         *       detected.
         *
         *       flipHorizontal: Optional. Default to false. When image data comes
         *       from camera, the result has to flip horizontally.
         *
         * @return An array of `Pose`s.
         */
        PosenetDetector.prototype.estimatePoses = function (image, estimationConfig) {
            if (estimationConfig === void 0) { estimationConfig = SINGLE_PERSON_ESTIMATION_CONFIG; }
            return __awaiter(this, void 0, void 0, function () {
                var config, _a, imageTensor, padding, imageValueShifted, results, offsets, heatmap, displacementFwd, displacementBwd, heatmapScores, poses, pose, imageSize, scaledPoses;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            config = validateEstimationConfig$2(estimationConfig);
                            if (image == null) {
                                return [2 /*return*/, []];
                            }
                            this.maxPoses = config.maxPoses;
                            _a = convertImageToTensor(image, {
                                outputTensorSize: this.inputResolution,
                                keepAspectRatio: true,
                                borderMode: 'replicate'
                            }), imageTensor = _a.imageTensor, padding = _a.padding;
                            imageValueShifted = this.architecture === 'ResNet50' ?
                                tf.add(imageTensor, RESNET_MEAN) :
                                shiftImageValue(imageTensor, [-1, 1]);
                            results = this.posenetModel.predict(imageValueShifted);
                            if (this.architecture === 'ResNet50') {
                                offsets = tf.squeeze(results[2], [0]);
                                heatmap = tf.squeeze(results[3], [0]);
                                displacementFwd = tf.squeeze(results[0], [0]);
                                displacementBwd = tf.squeeze(results[1], [0]);
                            }
                            else {
                                offsets = tf.squeeze(results[0], [0]);
                                heatmap = tf.squeeze(results[1], [0]);
                                displacementFwd = tf.squeeze(results[2], [0]);
                                displacementBwd = tf.squeeze(results[3], [0]);
                            }
                            heatmapScores = tf.sigmoid(heatmap);
                            if (!(this.maxPoses === 1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, decodeSinglePose(heatmapScores, offsets, this.outputStride)];
                        case 1:
                            pose = _b.sent();
                            poses = [pose];
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, decodeMultiplePoses(heatmapScores, offsets, displacementFwd, displacementBwd, this.outputStride, this.maxPoses, config.scoreThreshold, config.nmsRadius)];
                        case 3:
                            poses = _b.sent();
                            _b.label = 4;
                        case 4:
                            imageSize = getImageSize(image);
                            scaledPoses = scalePoses(poses, imageSize, this.inputResolution, padding);
                            if (config.flipHorizontal) {
                                scaledPoses = flipPosesHorizontal(scaledPoses, imageSize);
                            }
                            imageTensor.dispose();
                            imageValueShifted.dispose();
                            tf.dispose(results);
                            offsets.dispose();
                            heatmap.dispose();
                            displacementFwd.dispose();
                            displacementBwd.dispose();
                            heatmapScores.dispose();
                            return [2 /*return*/, scaledPoses];
                    }
                });
            });
        };
        PosenetDetector.prototype.dispose = function () {
            this.posenetModel.dispose();
        };
        PosenetDetector.prototype.reset = function () {
            // No-op. There's no global state.
        };
        return PosenetDetector;
    }());
    /**
     * Loads the PoseNet model instance from a checkpoint, with the ResNet
     * or MobileNet architecture. The model to be loaded is configurable using the
     * config dictionary ModelConfig. Please find more details in the
     * documentation of the ModelConfig.
     *
     * @param config ModelConfig dictionary that contains parameters for
     * the PoseNet loading process. Please find more details of each parameters
     * in the documentation of the ModelConfig interface. The predefined
     * `MOBILENET_V1_CONFIG` and `RESNET_CONFIG` can also be used as references
     * for defining your customized config.
     */
    function load$3(modelConfig) {
        if (modelConfig === void 0) { modelConfig = MOBILENET_V1_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            var config, defaultUrl_1, model_1, defaultUrl, model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = validateModelConfig$3(modelConfig);
                        if (!(config.architecture === 'ResNet50')) return [3 /*break*/, 2];
                        defaultUrl_1 = resNet50Checkpoint(config.outputStride, config.quantBytes);
                        return [4 /*yield*/, tfconv.loadGraphModel(config.modelUrl || defaultUrl_1)];
                    case 1:
                        model_1 = _a.sent();
                        return [2 /*return*/, new PosenetDetector(model_1, config)];
                    case 2:
                        defaultUrl = mobileNetCheckpoint(config.outputStride, config.multiplier, config.quantBytes);
                        return [4 /*yield*/, tfconv.loadGraphModel(config.modelUrl || defaultUrl)];
                    case 3:
                        model = _a.sent();
                        return [2 /*return*/, new PosenetDetector(model, config)];
                }
            });
        });
    }

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
     * Create a pose detector instance.
     *
     * @param model The name of the pipeline to load.
     */
    function createDetector(model, modelConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var config, runtime;
            return __generator(this, function (_a) {
                switch (model) {
                    case exports.SupportedModels.PoseNet:
                        return [2 /*return*/, load$3(modelConfig)];
                    case exports.SupportedModels.BlazePose:
                        config = modelConfig;
                        runtime = void 0;
                        if (config != null) {
                            if (config.runtime === 'tfjs') {
                                return [2 /*return*/, load$1(modelConfig)];
                            }
                            if (config.runtime === 'mediapipe') {
                                return [2 /*return*/, load(modelConfig)];
                            }
                            runtime = config.runtime;
                        }
                        throw new Error("Expect modelConfig.runtime to be either 'tfjs' " +
                            ("or 'mediapipe', but got " + runtime));
                    case exports.SupportedModels.MoveNet:
                        return [2 /*return*/, load$2(modelConfig)];
                    default:
                        throw new Error(model + " is not a supported model name.");
                }
            });
        });
    }

    var calculators = { keypointsToNormalizedKeypoints: keypointsToNormalizedKeypoints };
    var movenet = {
        modelType: {
            'SINGLEPOSE_LIGHTNING': SINGLEPOSE_LIGHTNING,
            'SINGLEPOSE_THUNDER': SINGLEPOSE_THUNDER,
            'MULTIPOSE_LIGHTNING': MULTIPOSE_LIGHTNING
        }
    };

    exports.calculators = calculators;
    exports.createDetector = createDetector;
    exports.movenet = movenet;
    exports.util = util;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
