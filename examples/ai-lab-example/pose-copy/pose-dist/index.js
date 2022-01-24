"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movenet = exports.calculators = exports.util = void 0;
var create_detector_1 = require("./create_detector");
Object.defineProperty(exports, "createDetector", { enumerable: true, get: function () { return create_detector_1.createDetector; } });
// Supported models enum.
__exportStar(require("./types"), exports);
var types_1 = require("./calculators/types");
Object.defineProperty(exports, "TrackerType", { enumerable: true, get: function () { return types_1.TrackerType; } });
// Second level exports.
// Utils for rendering.
var util = require("./util");
exports.util = util;
// General calculators.
var keypoints_to_normalized_keypoints_1 = require("./shared/calculators/keypoints_to_normalized_keypoints");
var calculators = { keypointsToNormalizedKeypoints: keypoints_to_normalized_keypoints_1.keypointsToNormalizedKeypoints };
exports.calculators = calculators;
// MoveNet model types.
var constants_1 = require("./movenet/constants");
var movenet = {
    modelType: {
        'SINGLEPOSE_LIGHTNING': constants_1.SINGLEPOSE_LIGHTNING,
        'SINGLEPOSE_THUNDER': constants_1.SINGLEPOSE_THUNDER,
        'MULTIPOSE_LIGHTNING': constants_1.MULTIPOSE_LIGHTNING
    }
};
exports.movenet = movenet;
//# sourceMappingURL=index.js.map