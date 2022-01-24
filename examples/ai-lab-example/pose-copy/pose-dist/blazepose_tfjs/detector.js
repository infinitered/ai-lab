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
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var constants_1 = require("../constants");
var calculate_alignment_points_rects_1 = require("../shared/calculators/calculate_alignment_points_rects");
var calculate_inverse_matrix_1 = require("../shared/calculators/calculate_inverse_matrix");
var calculate_landmark_projection_1 = require("../shared/calculators/calculate_landmark_projection");
var calculate_score_copy_1 = require("../shared/calculators/calculate_score_copy");
var calculate_world_landmark_projection_1 = require("../shared/calculators/calculate_world_landmark_projection");
var constants_2 = require("../shared/calculators/constants");
var convert_image_to_tensor_1 = require("../shared/calculators/convert_image_to_tensor");
var create_ssd_anchors_1 = require("../shared/calculators/create_ssd_anchors");
var detector_inference_1 = require("../shared/calculators/detector_inference");
var image_utils_1 = require("../shared/calculators/image_utils");
var is_video_1 = require("../shared/calculators/is_video");
var landmarks_to_detection_1 = require("../shared/calculators/landmarks_to_detection");
var mask_util_1 = require("../shared/calculators/mask_util");
var non_max_suppression_1 = require("../shared/calculators/non_max_suppression");
var normalized_keypoints_to_keypoints_1 = require("../shared/calculators/normalized_keypoints_to_keypoints");
var refine_landmarks_from_heatmap_1 = require("../shared/calculators/refine_landmarks_from_heatmap");
var remove_detection_letterbox_1 = require("../shared/calculators/remove_detection_letterbox");
var remove_landmark_letterbox_1 = require("../shared/calculators/remove_landmark_letterbox");
var segmentation_smoothing_1 = require("../shared/calculators/segmentation_smoothing");
var tensors_to_detections_1 = require("../shared/calculators/tensors_to_detections");
var tensors_to_landmarks_1 = require("../shared/calculators/tensors_to_landmarks");
var tensors_to_segmentation_1 = require("../shared/calculators/tensors_to_segmentation");
var transform_rect_1 = require("../shared/calculators/transform_rect");
var keypoints_smoothing_1 = require("../shared/filters/keypoints_smoothing");
var visibility_smoothing_1 = require("../shared/filters/visibility_smoothing");
var constants = require("./constants");
var detector_utils_1 = require("./detector_utils");
var BlazePoseTfjsMask = /** @class */ (function () {
    function BlazePoseTfjsMask(mask) {
        this.mask = mask;
    }
    BlazePoseTfjsMask.prototype.toCanvasImageSource = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mask_util_1.toHTMLCanvasElementLossy(this.mask)];
            });
        });
    };
    BlazePoseTfjsMask.prototype.toImageData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mask_util_1.toImageDataLossy(this.mask)];
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
function maskValueToLabel(maskValue) {
    mask_util_1.assertMaskValue(maskValue);
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
            create_ssd_anchors_1.createSsdAnchors(constants.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);
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
                        config = detector_utils_1.validateEstimationConfig(estimationConfig);
                        if (image == null) {
                            this.reset();
                            return [2 /*return*/, []];
                        }
                        this.maxPoses = config.maxPoses;
                        // User provided timestamp will override video's timestamp.
                        if (timestamp != null) {
                            this.timestamp = timestamp * constants_2.MILLISECOND_TO_MICRO_SECONDS;
                        }
                        else {
                            // For static images, timestamp should be null.
                            this.timestamp =
                                is_video_1.isVideo(image) ? image.currentTime * constants_2.SECOND_TO_MICRO_SECONDS : null;
                        }
                        imageSize = image_utils_1.getImageSize(image);
                        image3d = tf.tidy(function () { return tf.cast(image_utils_1.toImageTensor(image), 'float32'); });
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
                            normalized_keypoints_to_keypoints_1.normalizedKeypointsToKeypoints(poseLandmarks, imageSize) :
                            null;
                        // Add keypoint name.
                        if (keypoints != null) {
                            keypoints.forEach(function (keypoint, i) {
                                keypoint.name = constants_1.BLAZEPOSE_KEYPOINTS[i];
                            });
                        }
                        keypoints3D = poseWorldLandmarks;
                        // Add keypoint name.
                        if (keypoints3D != null) {
                            keypoints3D.forEach(function (keypoint3D, i) {
                                keypoint3D.name = constants_1.BLAZEPOSE_KEYPOINTS[i];
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
                                maskValueToLabel: maskValueToLabel,
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
            this.prevFilteredSegmentationMask = segmentation_smoothing_1.smoothSegmentation(prevMask, segmentationMask, constants.BLAZEPOSE_SEGMENTATION_SMOOTHING_CONFIG);
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
                        _a = convert_image_to_tensor_1.convertImageToTensor(image, constants.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG), imageValueShifted = _a.imageTensor, padding = _a.padding;
                        _b = detector_inference_1.detectorInference(imageValueShifted, this.detectorModel), boxes = _b.boxes, logits = _b.logits;
                        return [4 /*yield*/, tensors_to_detections_1.tensorsToDetections([logits, boxes], this.anchorTensor, constants.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION)];
                    case 1:
                        detections = _c.sent();
                        if (detections.length === 0) {
                            tf.dispose([imageValueShifted, logits, boxes]);
                            return [2 /*return*/, detections];
                        }
                        return [4 /*yield*/, non_max_suppression_1.nonMaxSuppression(detections, this.maxPoses, constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                                .minSuppressionThreshold, constants.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION
                                .overlapType)];
                    case 2:
                        selectedDetections = _c.sent();
                        newDetections = remove_detection_letterbox_1.removeDetectionLetterbox(selectedDetections, padding);
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
        var rawRoi = calculate_alignment_points_rects_1.calculateAlignmentPointsRects(detection, imageSize, {
            rotationVectorEndKeypointIndex: endKeypointIndex,
            rotationVectorStartKeypointIndex: startKeypointIndex,
            rotationVectorTargetAngleDegree: 90
        });
        // Expands pose rect with marging used during training.
        // PoseDetectionToRoi: RectTransformationCalculation.
        var roi = transform_rect_1.transformNormalizedRect(rawRoi, imageSize, constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
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
                        imageSize = image_utils_1.getImageSize(image);
                        _a = convert_image_to_tensor_1.convertImageToTensor(image, constants.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG, roi), imageValueShifted = _a.imageTensor, letterboxPadding = _a.padding, transformationMatrix = _a.transformationMatrix;
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
                adjustedLandmarks = remove_landmark_letterbox_1.removeLandmarkLetterbox(roiLandmarks, letterboxPadding);
                adjustedAuxiliaryLandmarks = remove_landmark_letterbox_1.removeLandmarkLetterbox(roiAuxiliaryLandmarks, letterboxPadding);
                landmarks = calculate_landmark_projection_1.calculateLandmarkProjection(adjustedLandmarks, roi);
                auxiliaryLandmarks = calculate_landmark_projection_1.calculateLandmarkProjection(adjustedAuxiliaryLandmarks, roi);
                worldLandmarks = calculate_world_landmark_projection_1.calculateWorldLandmarkProjection(roiWorldLandmarks, roi);
                segmentationMask = null;
                if (this.enableSegmentation) {
                    segmentationMask = tf.tidy(function () {
                        var _a = roiSegmentationMask.shape, inputHeight = _a[0], inputWidth = _a[1];
                        // Calculates the inverse transformation matrix.
                        // PoseLandmarksAndSegmentationInverseProjection:
                        // InverseMatrixCalculator.
                        var inverseTransformationMatrix = calculate_inverse_matrix_1.calculateInverseMatrix(transformationMatrix);
                        var projectiveTransform = tf.tensor2d(image_utils_1.getProjectiveTransformMatrix(inverseTransformationMatrix, { width: inputWidth, height: inputHeight }, imageSize), [1, 8]);
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
                        if (poseScore < constants.BLAZEPOSE_POSE_PRESENCE_SCORE) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, tensors_to_landmarks_1.tensorsToLandmarks(landmarkTensor, constants.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG)];
                    case 2:
                        rawLandmarks = _a.sent();
                        return [4 /*yield*/, refine_landmarks_from_heatmap_1.refineLandmarksFromHeatmap(rawLandmarks, heatmapTensor, constants.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG)];
                    case 3:
                        allLandmarks = _a.sent();
                        landmarks = allLandmarks.slice(0, constants.BLAZEPOSE_NUM_KEYPOINTS);
                        auxiliaryLandmarks = allLandmarks.slice(constants.BLAZEPOSE_NUM_KEYPOINTS, constants.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS);
                        return [4 /*yield*/, tensors_to_landmarks_1.tensorsToLandmarks(worldLandmarkTensor, constants.BLAZEPOSE_TENSORS_TO_WORLD_LANDMARKS_CONFIG)];
                    case 4:
                        allWorldLandmarks = _a.sent();
                        worldLandmarksWithoutVisibility = allWorldLandmarks.slice(0, constants.BLAZEPOSE_NUM_KEYPOINTS);
                        worldLandmarks = calculate_score_copy_1.calculateScoreCopy(landmarks, worldLandmarksWithoutVisibility, true);
                        segmentationMask = this.enableSegmentation ?
                            tensors_to_segmentation_1.tensorsToSegmentation(segmentationTensor, constants.BLAZEPOSE_TENSORS_TO_SEGMENTATION_CONFIG) :
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
        var detection = landmarks_to_detection_1.landmarksToDetection(landmarks);
        // Converts detection into a rectangle based on center and scale alignment
        // points.
        // PoseLandmarksToRoi: AlignmentPointsRectsCalculator.
        var rawRoi = calculate_alignment_points_rects_1.calculateAlignmentPointsRects(detection, imageSize, {
            rotationVectorStartKeypointIndex: 0,
            rotationVectorEndKeypointIndex: 1,
            rotationVectorTargetAngleDegree: 90
        });
        // Expands pose rect with marging used during training.
        // PoseLandmarksToRoi: RectTransformationCalculator.
        var roi = transform_rect_1.transformNormalizedRect(rawRoi, imageSize, constants.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG);
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
            var auxDetection = landmarks_to_detection_1.landmarksToDetection(auxiliaryLandmarks);
            var objectScaleROI = calculate_alignment_points_rects_1.calculateAlignmentPointsRects(auxDetection, imageSize, {
                rotationVectorEndKeypointIndex: 0,
                rotationVectorStartKeypointIndex: 1,
                rotationVectorTargetAngleDegree: 90
            });
            // Smoothes pose landmark visibilities to reduce jitter.
            if (this.visibilitySmoothingFilterActual == null) {
                this.visibilitySmoothingFilterActual = new visibility_smoothing_1.LowPassVisibilityFilter(constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
            }
            actualLandmarksFiltered =
                this.visibilitySmoothingFilterActual.apply(actualLandmarks);
            if (this.visibilitySmoothingFilterAuxiliary == null) {
                this.visibilitySmoothingFilterAuxiliary = new visibility_smoothing_1.LowPassVisibilityFilter(constants.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG);
            }
            auxiliaryLandmarksFiltered =
                this.visibilitySmoothingFilterAuxiliary.apply(auxiliaryLandmarks);
            actualWorldLandmarksFiltered =
                this.visibilitySmoothingFilterActual.apply(actualWorldLandmarks);
            // Smoothes pose landmark coordinates to reduce jitter.
            if (this.landmarksSmoothingFilterActual == null) {
                this.landmarksSmoothingFilterActual = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
            }
            actualLandmarksFiltered = this.landmarksSmoothingFilterActual.apply(actualLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
            if (this.landmarksSmoothingFilterAuxiliary == null) {
                this.landmarksSmoothingFilterAuxiliary = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY);
            }
            auxiliaryLandmarksFiltered = this.landmarksSmoothingFilterAuxiliary.apply(auxiliaryLandmarksFiltered, this.timestamp, imageSize, true /* normalized */, objectScaleROI);
            // Smoothes pose world landmark coordinates to reduce jitter.
            if (this.worldLandmarksSmoothingFilterActual == null) {
                this.worldLandmarksSmoothingFilterActual = new keypoints_smoothing_1.KeypointsSmoothingFilter(constants.BLAZEPOSE_WORLD_LANDMARKS_SMOOTHING_CONFIG_ACTUAL);
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
function load(modelConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var config, detectorFromTFHub, landmarkFromTFHub, _a, detectorModel, landmarkModel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = detector_utils_1.validateModelConfig(modelConfig);
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
exports.load = load;
//# sourceMappingURL=detector.js.map