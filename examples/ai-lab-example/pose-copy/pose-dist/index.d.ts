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
export { BlazePoseMediaPipeEstimationConfig, BlazePoseMediaPipeModelConfig, BlazePoseModelType } from './blazepose_mediapipe/types';
export { BlazePoseTfjsEstimationConfig, BlazePoseTfjsModelConfig } from './blazepose_tfjs/types';
export { createDetector } from './create_detector';
export { MoveNetEstimationConfig, MoveNetModelConfig } from './movenet/types';
export { PoseDetector } from './pose_detector';
export { PoseNetEstimationConfig, PosenetModelConfig } from './posenet/types';
export * from './types';
export { TrackerType } from './calculators/types';
import * as util from './util';
export { util };
import { keypointsToNormalizedKeypoints } from './shared/calculators/keypoints_to_normalized_keypoints';
declare const calculators: {
    keypointsToNormalizedKeypoints: typeof keypointsToNormalizedKeypoints;
};
export { calculators };
declare const movenet: {
    modelType: {
        SINGLEPOSE_LIGHTNING: string;
        SINGLEPOSE_THUNDER: string;
        MULTIPOSE_LIGHTNING: string;
    };
};
export { movenet };
