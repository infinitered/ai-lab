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

  const tensorFlowIt = async (img: tf.Tensor3D) => {
    if (!img) {
      return;
    }
    const model = await tf.loadGraphModel(modelPath);

    const readyfied = tf.expandDims(img, 0);
    const results = await model.executeAsync(readyfied);

    // Prep Canvas
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    canvas.width = tensorDims.width;
    canvas.height = tensorDims.height;
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';

    // Get a clean tensor of top indices
    const detectionThreshold = 0.4;
    const iouThreshold = 0.4;
    const maxBoxes = 20;
    const prominentDetection = tf.topk(results[0]);
    const justBoxes = results[1].squeeze<tf.Tensor<tf.Rank.R2>>();
    const justValues = prominentDetection.values.squeeze<
      tf.Tensor<tf.Rank.R1>
    >();

    // Move results back to JavaScript in parallel
    const [maxIndices, scores, boxes] = await Promise.all([
      prominentDetection.indices.data(),
      justValues.array(),
      justBoxes.array(),
    ]);

    // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
    const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
      justBoxes, // [numBoxes, 4]
      justValues, // [numBoxes]
      maxBoxes,
      iouThreshold,
      detectionThreshold,
      1 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
    );
    const chosen = await nmsDetections.selectedIndices.data();

    // Mega Clean
    // tf.dispose([
    //   results[0],
    //   results[1],
    //   model,
    //   nmsDetections.selectedIndices,
    //   nmsDetections.selectedScores,
    //   prominentDetection.indices,
    //   prominentDetection.values,
    //   img,
    //   readyfied,
    //   justBoxes,
    //   justValues,
    // ]);

    // Drawing time measuring starts
    let start = performance.now();

    for (const detection of chosen) {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 4;
      ctx.globalCompositionOperation = 'destination-over';
      const detectedIndex = maxIndices[detection];
      const detectedClass = CLASSES[detectedIndex];
      const detectedScore = scores[detection];
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * tensorDims.height : 0;
      const startX = dBox[1] > 0 ? dBox[1] * tensorDims.width : 0;
      const boxHeight = (dBox[2] - dBox[0]) * tensorDims.height;
      const boxWidth = (dBox[3] - dBox[1]) * tensorDims.width;
      ctx.strokeRect(startX, startY, boxWidth, boxHeight);

      // Draw the label background.
      ctx.globalCompositionOperation = 'source-over';
      const textHeight = 16;
      const textPad = 4;
      const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
      const textWidth = (await ctx.measureText(label)).width;
      ctx.fillStyle = '#0B0';
      ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(label, startX, startY);
    }
    // Drawing time measuring ends
    setDrawingTime(performance.now() - start);
  };

  const handleCameraStream = (img: IterableIterator<tf.Tensor3D>) => {
    const loop = async () => {
      const nextImageTensor = await img.next().value;
      await tensorFlowIt(nextImageTensor);

      // if autorender is false you need the following two lines.
      // updatePreview();
      // gl.endFrameEXP();

      requestAnimationFrame(loop);
    };
    loop();
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

  return (
    <View style={styles.cameraView}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        // zoom={0}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={300}
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
