import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Canvas from 'react-native-canvas';
import { CLASSES } from '../labels';

import {
  Performance,
  PerformanceInfo,
  PerformanceProps,
} from '../../performance';
// import { CLASSES } from '../labels';

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}

export const AILabNativeCamera = ({
  perf,
  perfCallback,
  ...props
}: VideoProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [predictionFound, setPredictionFound] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>();

  const canvasRef = useRef<Canvas>(null);
  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';
  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;

  const textureDims =
    Platform.OS === 'ios'
      ? { width: 1080, height: 1920 }
      : { width: 1600, height: 1200 };

  //Fixed output tensor width and height (based on TF model).
  const tensorDims = { width: 300, height: 200 };

  // async function getPermission() {
  //   const { status } = await Camera.requestPermissionsAsync();
  //   console.log(`permissions status: ${status}`);
  //   setHasPermission(status === 'granted');
  // }

  // const tensorFlowIt = async (img: tf.Tensor3D, model: tf.GraphModel) => {
  //   if (!img) {
  //     return;
  //   }
  //   const readyfied = tf.expandDims(img, 0);
  //   const results = await model.executeAsync(readyfied);

  //   // Prep Canvas
  //   const canvas = canvasRef.current!;
  //   const ctx = canvas.getContext('2d');
  //   canvas.width = width;
  //   canvas.height = height;
  //   ctx.font = '16px sans-serif';
  //   ctx.textBaseline = 'top';

  //   // Get a clean tensor of top indices
  //   const detectionThreshold = 0.4;
  //   const iouThreshold = 0.4;
  //   const maxBoxes = 20;
  //   const prominentDetection = tf.topk(results[0]);
  //   const justBoxes = results[1].squeeze<tf.Tensor<tf.Rank.R2>>();
  //   const justValues = prominentDetection.values.squeeze<
  //     tf.Tensor<tf.Rank.R1>
  //   >();

  //   // Move results back to JavaScript in parallel
  //   const [maxIndices, scores, boxes] = await Promise.all([
  //     prominentDetection.indices.data(),
  //     justValues.array(),
  //     justBoxes.array(),
  //   ]);

  //   // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
  //   const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
  //     justBoxes, // [numBoxes, 4]
  //     justValues, // [numBoxes]
  //     maxBoxes,
  //     iouThreshold,
  //     detectionThreshold,
  //     1 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
  //   );

  // if (results[0].probability > 0.3) {
  //   cancelAnimationFrame(requestAnimationFrameId);
  // }
  // };

  const getPrediction = async (
    tensor:
      | string
      | number
      | boolean
      | tf.Tensor<tf.Rank>
      | tf.TypedArray
      | tf.RecursiveArray<number | tf.TypedArray | number[]>
      | tf.RecursiveArray<boolean>
      | tf.RecursiveArray<string>
      | Uint8Array[]
  ) => {
    if (!tensor) {
      return;
    }
    const model = await tf.loadGraphModel(modelPath);

    const readyfied = tf.expandDims(tensor, 0);
    const results = await model.executeAsync(readyfied);

    //stop looping!
    cancelAnimationFrame(requestAnimationFrameId);
    setPredictionFound(true);
  };

  const handleCameraStream = (img: IterableIterator<tf.Tensor3D>) => {
    const loop = async () => {
      const nextImageTensor = await img.next().value;
      await getPrediction(nextImageTensor);

      // if autorender is false you need the following two lines.
      // updatePreview();
      // gl.endFrameEXP();

      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if (!predictionFound) loop();
  };

  useEffect(() => {
    tf.ready().then(() => setIsTFReady(true));
    // getPermission();
  }, []);

  // useEffect(() => {
  //   const setupTFJS = async () => {
  //     const model = await tf.loadGraphModel(modelPath);
  //     // if (perf || perfCallback) {
  //     //   const perfMetrics = await perfInfo(async () => {
  //     //     await tensorFlowIt(model);
  //     //   });
  //     //   if (perf) {
  //     //     setPerfProps(perfMetrics);
  //     //   }
  //     //   if (perfCallback) {
  //     //     perfCallback(perfMetrics);
  //     //   }
  //     // } else {
  //     // tensorFlowIt(video, model);
  //     // }
  //   };

  //   if (isTFReady) {
  //     setupTFJS();
  //   }
  // }, [isTFReady]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  return (
    <View style={styles.cameraView}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        zoom={0}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={tensorDims.height}
        resizeWidth={tensorDims.width}
        resizeDepth={3}
        onReady={img => handleCameraStream(img)}
        autorender={true}
        useCustomShadersToResize={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  cameraView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 10,
  },
});
