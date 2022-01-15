import * as tf from '@tensorflow/tfjs';
import React from 'react';
import { PerformanceProps } from './performance';

export interface ModelConfig {
  iouThreshold?: number;
  labels?: string[];
  maxResults?: number;
  modelType: 'classification' | 'ssd';
  nmsActive?: boolean;
  threshold?: number;
  topK?: number;
}

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
  PerformanceProps & {
    model: tf.GraphModel | tf.LayersModel;
    modelConfig?: ModelConfig;
    ObjectDetectionUI?: (props: ObjectDetectionUIProps) => JSX.Element;
    onInference?: (inferenceData: any) => void;
    size?: number;
    visual?: boolean;
  };

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}

export interface Detections {
  detections: Float32Array | Int32Array | Uint8Array;
  maxIndices: Float32Array | Int32Array | Uint8Array;
  scores: number[];
  boxes: number[][];
}

export interface ObjectDetectionUIProps {
  detectionResults: Detections;
  height: number;
  modelConfig: ModelConfig;
  onDrawComplete?: (durationMs: number) => void;
  width: number;
}

export type Results =
  | tf.Tensor<tf.Rank>
  | tf.Tensor<tf.Rank>[]
  | tf.NamedTensorMap
  | tf.Tensor2D;
