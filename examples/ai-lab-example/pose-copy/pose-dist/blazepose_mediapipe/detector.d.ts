import { PoseDetector } from '../pose_detector';
import { BlazePoseMediaPipeModelConfig } from './types';
/**
 * Loads the MediaPipe solution.
 *
 * @param modelConfig ModelConfig object that contains parameters for
 * the BlazePose loading process. Please find more details of each parameters
 * in the documentation of the `BlazePoseMediaPipeModelConfig` interface.
 */
export declare function load(modelConfig: BlazePoseMediaPipeModelConfig): Promise<PoseDetector>;
