import { SupportedModels } from './types';
export declare function getKeypointIndexBySide(model: SupportedModels): {
    left: number[];
    right: number[];
    middle: number[];
};
export declare function getAdjacentPairs(model: SupportedModels): number[][];
export declare function getKeypointIndexByName(model: SupportedModels): {
    [index: string]: number;
};
