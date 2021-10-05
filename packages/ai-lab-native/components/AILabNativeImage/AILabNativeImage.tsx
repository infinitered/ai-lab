import React, { useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs-react-native';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { View, Image } from 'react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

interface ImageProps {
  src: string;
}

export const AILabNativeImage = ({ src, ...props }: ImageProps) => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  let image;

  useEffect(() => {
    (async () => {
      await tf.ready();
      const model = await mobilenet.load();
      setModel(model);

      if (model) {
        image = src;
        //@ts-ignore
        const imageAssetPath = Image.resolveAssetSource(image);
        const response = await fetch(
          imageAssetPath.uri,
          {},
          { isBinary: true }
        );
        const imageData = await response.arrayBuffer();

        //@ts-ignore
        const imageTensor = decodeJpeg(imageData);
        //@ts-ignore
        const prediction = await model.classify(imageTensor);
        setPrediction(prediction);
      }
    })();
  }, []);

  return (
    <View>
      <Image source={image} />
    </View>
  );
};
