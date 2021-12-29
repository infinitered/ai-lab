import * as tf from '@tensorflow/tfjs';
import React from 'react';
import { PerformanceProps } from './performance';

export interface ModelInfo {
  iouThreshold?: number;
  maxBoxes: number;
  modelType: 'classification' | 'ssd';
  nmsActive?: boolean;
  threshold?: number;
}

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
  PerformanceProps & {
    model: tf.GraphModel;
    modelInfo?: ModelInfo;
    ObjectDetectionUI?: (props: ObjectDetectionUIProps) => JSX.Element;
    visual?: boolean;
  };

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}

export interface ObjectDetectionUIProps {
  detectionResults: {
    prominentDetection: {
      values: tf.Tensor<tf.Rank>;
      indices: tf.Tensor<tf.Rank>;
    };
    justBoxes: tf.Tensor<tf.Rank.R2>;
    justValues: tf.Tensor<tf.Rank.R1>;
  };
  height: number;
  modelInfo: ModelInfo;
  onDrawComplete?: (durationMs: number) => void;
  width: number;
}
