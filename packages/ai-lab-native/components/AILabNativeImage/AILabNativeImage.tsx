import React, { useEffect, useRef, useState } from 'react';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { View, Image, ImageSourcePropType, Text } from 'react-native';
import Canvas from 'react-native-canvas';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from './labels.js';

interface ImageProps {
  source: ImageSourcePropType;
}

export const AILabNativeImage = ({ source, ...props }: ImageProps) => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isTfReady, setIsTfReady] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // useEffect(() => {
  //   async function tensorFlowIt() {
  //     console.log('called effect async');
  //     await tf.ready();
  //     console.log('called effect ready');
  //     setIsTfReady(true);
  //     const model = await mobilenet.load();
  //     setIsModelReady(true);

  //     if (model) {
  //       const imageAssetPath = Image.resolveAssetSource(source);
  //       const response = await fetch(
  //         imageAssetPath.uri,
  //         {},
  //         { isBinary: true }
  //       );
  //       const imageData = (await response.arrayBuffer()) as Uint8Array;
  //       const imageTensor = decodeJpeg(imageData);
  //       const prediction = await model.classify(imageTensor);
  //       setPrediction(prediction);
  //     }
  //   }

  //   tensorFlowIt();
  // }, [source]);

  const imgRef = useRef();
  const canvasRef = useRef();
  const [model, setModel] = useState<tf.GraphModel>();

  const modelPath =
    'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1';

  useEffect(() => {
    async function loadModel(modelPath: string | tf.io.IOHandler) {
      try {
        const model = await tf.loadGraphModel(modelPath, { fromTFHub: true });
        setModel(model);
      } catch (err) {
        console.log(err);
      }
    }

    tf.ready().then(() => {
      setIsTfReady(true);
      loadModel(modelPath);
      setIsModelReady(true);
    });
  }, []);

  useEffect(() => {
    if (model) {
      async function tensorFlowIt() {
        const aiImage = imgRef.current as HTMLImageElement;
        const myTensor = tf.browser.fromPixels(aiImage);
        // SSD Mobilenet single batch
        const readyfied = tf.expandDims(myTensor, 0);
        const results = await model.executeAsync(readyfied);
        // Prep Canvas
        const detection = canvasRef.current as HTMLCanvasElement;
        const ctx = detection.getContext('2d');
        const imgWidth = aiImage.width;
        const imgHeight = aiImage.height;
        detection.width = imgWidth;
        detection.height = imgHeight;
        ctx.font = '16px sans-serif';
        ctx.textBaseline = 'top';

        // Get a clean tensor of top indices
        const detectionThreshold = 0.4;
        const iouThreshold = 0.5;
        const maxBoxes = 20;
        const prominentDetection = tf.topk(results[0]);
        const justBoxes = results[1].squeeze();
        const justValues = prominentDetection.values.squeeze();

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
        tf.dispose([
          results[0],
          results[1],
          model,
          nmsDetections.selectedIndices,
          nmsDetections.selectedScores,
          prominentDetection.indices,
          prominentDetection.values,
          myTensor,
          readyfied,
          justBoxes,
          justValues,
        ]);

        chosen.forEach((detection: string | number) => {
          ctx.strokeStyle = '#0F0';
          ctx.lineWidth = 4;
          ctx.globalCompositeOperation = 'destination-over';
          const detectedIndex = maxIndices[detection];
          const detectedClass = CLASSES[detectedIndex];
          const detectedScore = scores[detection];
          const dBox = boxes[detection];

          // No negative values for start positions
          const startY = dBox[0] > 0 ? dBox[0] * imgHeight : 0;
          const startX = dBox[1] > 0 ? dBox[1] * imgWidth : 0;
          const height = (dBox[2] - dBox[0]) * imgHeight;
          const width = (dBox[3] - dBox[1]) * imgWidth;
          ctx.strokeRect(startX, startY, width, height);
          // Draw the label background.
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#0B0';
          const textHeight = 16;
          const textPad = 4;
          const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(
            startX,
            startY,
            textWidth + textPad,
            textHeight + textPad
          );
          // Draw the text last to ensure it's on top.
          ctx.fillStyle = '#000000';
          ctx.fillText(label, startX, startY);
        });
      }
      tensorFlowIt();
    }
  }, [model]);

  return (
    <View
      style={{
        height: 300,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image source={source} style={{ width: '50%', height: '50%' }} />
      {/* <Canvas ref={canvasRef}/> */}
      <Text>TFJS ready? {isTfReady ? 'yes' : 'no'}</Text>
      <Text>
        Model ready?{' '}
        {isModelReady ? <Text>Yes</Text> : <Text>Loading Model...</Text>}
      </Text>
    </View>
  );
};
