import * as tf from '@tensorflow/tfjs';
import { ProfileInfo } from '@tensorflow/tfjs-core/dist/engine';
import React from 'react';
import { View, Text } from 'react-native';

const numberWithCommas = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatKB = (bytes: number) => numberWithCommas(Math.round(bytes / 1024));

export type PerformanceInfo = tf.MemoryInfo & ProfileInfo & tf.TimingInfo;

export const perfInfo = async (callback: () => void | Promise<void>) => {
  let timeInfo: tf.TimingInfo = { kernelMs: 0, wallMs: 0 };
  const profileInfo = await tf.profile(async () => {
    timeInfo = await tf.time(callback);
  });
  const memoryInfo = tf.memory();
  console.log('timeInfo: ', timeInfo);
  console.log('profileInfo: ', profileInfo);
  return { ...memoryInfo, ...profileInfo, ...timeInfo };
};

export const Performance = ({
  peakBytes,
  newBytes,
  newTensors,
  wallMs,
}: PerformanceInfo) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Code Result Memory</Text>
      <Text>New Bytes: {formatKB(newBytes)} KB</Text>
      <Text>New Tensors: {newTensors}</Text>
      <Text>Peak Bytes: {formatKB(peakBytes < 0 ? 0 : peakBytes)} KB</Text>
      <Text>Execution: {wallMs.toFixed(2)} ms</Text>
    </View>
  );
};

const styles = {
  container: {
    // backgroundColor: '#3a3d4f',
  },
  title: {
    // margin: 0,
    // borderColor: '#44475c',
    // borderWidth: 1,
    // backgroundColor: '#3f4255',
    // textAlign: 'center',
    // fontSize: 16,
  },
};
