import * as tf from '@tensorflow/tfjs';
import React from 'react';
import { PerformanceProps } from './performance';

export interface ModelInfo {
  // The the allowed area for intersection over union (IOU)
  // between the bounding box with other bounding boxes.
  iouThreshold?: number;
  // The number of boxes to keep after applying NMS.
  maxBoxes: number;
  // The model type, which identifies the output structure to expect.
  modelType: 'classification' | 'ssd';
  // The soft NMS Sigma that allows overlapping of strong object confidence.
  nmsActive?: boolean;
  // The score threshold to identify if a value is returned.
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
