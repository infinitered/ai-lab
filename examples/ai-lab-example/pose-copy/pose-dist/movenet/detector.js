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
var tfc = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var bounding_box_tracker_1 = require("../calculators/bounding_box_tracker");
var keypoint_tracker_1 = require("../calculators/keypoint_tracker");
var types_1 = require("../calculators/types");
var constants_1 = require("../constants");
var constants_2 = require("../shared/calculators/constants");
var image_utils_1 = require("../shared/calculators/image_utils");
var is_video_1 = require("../shared/calculators/is_video");
var keypoints_one_euro_filter_1 = require("../shared/filters/keypoints_one_euro_filter");
var low_pass_filter_1 = require("../shared/filters/low_pass_filter");
var types_2 = require("../types");
var util_1 = require("../util");
var constants_3 = require("./constants");
var crop_utils_1 = require("./crop_utils");
var detector_utils_1 = require("./detector_utils");
/**
 * MoveNet detector class.
 */
var MoveNetDetector = /** @class */ (function () {
    function MoveNetDetector(moveNetModel, config) {
        this.moveNetModel = moveNetModel;
        this.modelInputResolution = { height: 0, width: 0 };
        this.keypointIndexByName = util_1.getKeypointIndexByName(types_2.SupportedModels.MoveNet);
        // Only single-pose models have a fixed input resolution.
        if (config.modelType === constants_3.SINGLEPOSE_LIGHTNING) {
            this.modelInputResolution.width = constants_3.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
            this.modelInputResolution.height =
                constants_3.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION;
        }
        else if (config.modelType === constants_3.SINGLEPOSE_THUNDER) {
            this.modelInputResolution.width = constants_3.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
            this.modelInputResolution.height = constants_3.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION;
        }
        this.multiPoseModel = config.modelType === constants_3.MULTIPOSE_LIGHTNING;
        if (!this.multiPoseModel) {
            this.keypointFilter = new keypoints_one_euro_filter_1.KeypointsOneEuroFilter(constants_3.KEYPOINT_FILTER_CONFIG);
            this.cropRegionFilterYMin = new low_pass_filter_1.LowPassFilter(constants_3.CROP_FILTER_ALPHA);
            this.cropRegionFilterXMin = new low_pass_filter_1.LowPassFilter(constants_3.CROP_FILTER_ALPHA);
            this.cropRegionFilterYMax = new low_pass_filter_1.LowPassFilter(constants_3.CROP_FILTER_ALPHA);
            this.cropRegionFilterXMax = new low_pass_filter_1.LowPassFilter(constants_3.CROP_FILTER_ALPHA);
        }
        this.enableSmoothing = config.enableSmoothing;
        if (config.minPoseScore) {
            this.minPoseScore = config.minPoseScore;
        }
        else {
            this.minPoseScore = constants_3.DEFAULT_MIN_POSE_SCORE;
        }
        if (config.multiPoseMaxDimension) {
            this.multiPoseMaxDimension = config.multiPoseMaxDimension;
        }
        else {
            this.multiPoseMaxDimension = constants_3.MOVENET_MULTIPOSE_DEFAULT_MAX_DIMENSION;
        }
        this.enableTracking = config.enableTracking;
        if (this.multiPoseModel && this.enableTracking) {
            if (config.trackerType === types_1.TrackerType.Keypoint) {
                this.tracker = new keypoint_tracker_1.KeypointTracker(config.trackerConfig);
            }
            else if (config.trackerType === types_1.TrackerType.BoundingBox) {
                this.tracker = new bounding_box_tracker_1.BoundingBoxTracker(config.trackerConfig);
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
                            outputTensor.shape[2] !== constants_3.NUM_KEYPOINTS ||
                            outputTensor.shape[3] !== constants_3.NUM_KEYPOINT_VALUES) {
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
                        for (i = 0; i < constants_3.NUM_KEYPOINTS; ++i) {
                            pose.keypoints[i] = {
                                y: inferenceResult[i * constants_3.NUM_KEYPOINT_VALUES],
                                x: inferenceResult[i * constants_3.NUM_KEYPOINT_VALUES + 1],
                                score: inferenceResult[i * constants_3.NUM_KEYPOINT_VALUES + 2]
                            };
                            if (pose.keypoints[i].score > constants_3.MIN_CROP_KEYPOINT_SCORE) {
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
                            outputTensor.shape[2] !== constants_3.MULTIPOSE_INSTANCE_SIZE) {
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
                        numInstances = inferenceResult.length / constants_3.MULTIPOSE_INSTANCE_SIZE;
                        for (i = 0; i < numInstances; ++i) {
                            poses[i] = { keypoints: [] };
                            boxIndex = i * constants_3.MULTIPOSE_INSTANCE_SIZE + constants_3.MULTIPOSE_BOX_IDX;
                            poses[i].box = {
                                yMin: inferenceResult[boxIndex],
                                xMin: inferenceResult[boxIndex + 1],
                                yMax: inferenceResult[boxIndex + 2],
                                xMax: inferenceResult[boxIndex + 3],
                                width: inferenceResult[boxIndex + 3] - inferenceResult[boxIndex + 1],
                                height: inferenceResult[boxIndex + 2] - inferenceResult[boxIndex]
                            };
                            scoreIndex = i * constants_3.MULTIPOSE_INSTANCE_SIZE + constants_3.MULTIPOSE_BOX_SCORE_IDX;
                            poses[i].score = inferenceResult[scoreIndex];
                            poses[i].keypoints = [];
                            for (j = 0; j < constants_3.NUM_KEYPOINTS; ++j) {
                                poses[i].keypoints[j] = {
                                    y: inferenceResult[i * constants_3.MULTIPOSE_INSTANCE_SIZE + j * constants_3.NUM_KEYPOINT_VALUES],
                                    x: inferenceResult[i * constants_3.MULTIPOSE_INSTANCE_SIZE + j * constants_3.NUM_KEYPOINT_VALUES + 1],
                                    score: inferenceResult[i * constants_3.MULTIPOSE_INSTANCE_SIZE + j * constants_3.NUM_KEYPOINT_VALUES + 2]
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
        if (estimationConfig === void 0) { estimationConfig = constants_3.MOVENET_ESTIMATION_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            var imageTensor3D, imageSize, imageTensor4D, poses, poseIdx, keypointIdx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        estimationConfig = detector_utils_1.validateEstimationConfig(estimationConfig);
                        if (image == null) {
                            this.reset();
                            return [2 /*return*/, []];
                        }
                        if (timestamp == null) {
                            if (is_video_1.isVideo(image)) {
                                timestamp = image.currentTime * constants_2.SECOND_TO_MICRO_SECONDS;
                            }
                        }
                        else {
                            timestamp = timestamp * constants_2.MILLISECOND_TO_MICRO_SECONDS;
                        }
                        imageTensor3D = image_utils_1.toImageTensor(image);
                        imageSize = image_utils_1.getImageSize(imageTensor3D);
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
                                    constants_1.COCO_KEYPOINTS[keypointIdx];
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
                            this.cropRegion = crop_utils_1.initCropRegion(this.cropRegion == null, imageSize);
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
                        nextCropRegion = crop_utils_1.determineNextCropRegion(this.cropRegion, pose.keypoints, this.keypointIndexByName, imageSize);
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
                                        this.keypointFilterMap.set(poses[i].id, new keypoints_one_euro_filter_1.KeypointsOneEuroFilter(constants_3.KEYPOINT_FILTER_CONFIG));
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
function load(modelConfig) {
    if (modelConfig === void 0) { modelConfig = constants_3.MOVENET_CONFIG; }
    return __awaiter(this, void 0, void 0, function () {
        var config, model, fromTFHub, modelUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = detector_utils_1.validateModelConfig(modelConfig);
                    fromTFHub = true;
                    if (!!!config.modelUrl) return [3 /*break*/, 2];
                    fromTFHub = typeof config.modelUrl === 'string' &&
                        config.modelUrl.indexOf('https://tfhub.dev') > -1;
                    return [4 /*yield*/, tfc.loadGraphModel(config.modelUrl, { fromTFHub: fromTFHub })];
                case 1:
                    model = _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    modelUrl = void 0;
                    if (config.modelType === constants_3.SINGLEPOSE_LIGHTNING) {
                        modelUrl = constants_3.MOVENET_SINGLEPOSE_LIGHTNING_URL;
                    }
                    else if (config.modelType === constants_3.SINGLEPOSE_THUNDER) {
                        modelUrl = constants_3.MOVENET_SINGLEPOSE_THUNDER_URL;
                    }
                    else if (config.modelType === constants_3.MULTIPOSE_LIGHTNING) {
                        modelUrl = constants_3.MOVENET_MULTIPOSE_LIGHTNING_URL;
                    }
                    return [4 /*yield*/, tfc.loadGraphModel(modelUrl, { fromTFHub: fromTFHub })];
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
exports.load = load;
//# sourceMappingURL=detector.js.map