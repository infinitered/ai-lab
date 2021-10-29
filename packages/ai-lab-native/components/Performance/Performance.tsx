import * as tf from '@tensorflow/tfjs';
import React from 'react';
import { View, Text } from 'react-native';
import { Memory } from '../Memory';

export type PerformanceInfo = tf.TimingInfo & { drawingTime?: number };

export const perfInfo = async (callback: () => void | Promise<void>) => {
  let timeInfo: tf.TimingInfo = { kernelMs: 0, wallMs: 0 };
  timeInfo = await tf.time(callback);

  // profileInfo isn't set since tf.time and tf.profile can not be nested and they both take callbacks.
  // const profileInfo = await tf.profile(callback)

  return { ...timeInfo };
};

export const Performance = ({ drawingTime, wallMs }: PerformanceInfo) => {
  return (
    <View>
      <View style={styles.container}>
        {/* kernelMs returns an error : "WebGL query timers are not supported in
      this environment." So we used wallMs to measure excute time */}
        <Text style={styles.textStyle}>Execution: {wallMs.toFixed(2)} ms</Text>
        {!!drawingTime && (
          <Text style={styles.textStyle}>
            Drawing Time: {drawingTime.toFixed(2)} ms
          </Text>
        )}
      </View>
      <View style={styles.container}>
        {/* The second metrics box on the screen */}
        <Memory pollingFrequency={3000} />
      </View>
    </View>
  );
};

const styles = {
  container: {
    margin: 20,
    padding: 10,
    borderColor: '#44475c',
    borderWidth: 1,
    backgroundColor: '#3f4255',
    fontSize: 16,
  },
  textStyle: {
    color: '#fff',
  },
};
