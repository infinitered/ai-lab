"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG = void 0;
exports.DEFAULT_BLAZEPOSE_MODEL_CONFIG = {
    runtime: 'mediapipe',
    enableSmoothing: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    modelType: 'full'
};
exports.DEFAULT_BLAZEPOSE_ESTIMATION_CONFIG = {
    maxPoses: 1,
    flipHorizontal: false
};
//# sourceMappingURL=constants.js.map