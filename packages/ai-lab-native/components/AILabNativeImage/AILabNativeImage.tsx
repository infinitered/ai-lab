import React, { useEffect, useState } from 'react';
import '@tensorflow/tfjs-react-native';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { View, Image, ImageSourcePropType } from 'react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

interface ImageProps {
  source: ImageSourcePropType;
}

export const AILabNativeImage = ({ source, ...props }: ImageProps) => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    (async () => {
      await tf.ready();
      const model = await mobilenet.load();
      setModel(model);

      if (model) {
        const imageAssetPath = Image.resolveAssetSource(source);
        const response = await fetch(
          imageAssetPath.uri,
          {},
          { isBinary: true }
        );
        const imageData = (await response.arrayBuffer()) as Uint8Array;
        const imageTensor = decodeJpeg(imageData);
        const prediction = await model.classify(imageTensor);
        setPrediction(prediction);
      }
    })();
  }, [source]);

  return (
    <View>
      <Image source={source} />
    </View>
  );
};
