import * as tf from '@tensorflow/tfjs';
import { PerformanceProps } from './performance';

export interface ModelInfo {
  iouThreshold?: number;
  maxBoxes: number;
  modelType: 'classification' | 'ssd';
  nmsActive?: boolean;
  threshold?: number;
}

export interface ImageLabProps {
  model: tf.GraphModel;
  modelInfo?: ModelInfo;
  visual?: boolean;
}

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
  PerformanceProps &
  ImageLabProps;

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}
