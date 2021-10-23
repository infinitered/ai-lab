import * as tf from '@tensorflow/tfjs';
import { ProfileInfo } from '@tensorflow/tfjs-core/dist/engine';
import React from 'react';

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
  kernelMs,
}: PerformanceInfo) => {
  return (
    <div style={styles.container}>
      <p style={styles.title}>Code Result Memory</p>
      <div style={styles.memBox}>
        <div style={styles.dataPoint}>
          <p>New Bytes: {formatKB(newBytes)} KB </p>
        </div>
        <div style={styles.dataPoint}>
          <p>New Tensors: {newTensors}</p>
        </div>
        <div style={styles.dataPoint}>
          <p>Peak Bytes: {formatKB(peakBytes < 0 ? 0 : peakBytes)} KB</p>
        </div>
        <div style={styles.dataPoint}>
          <p>Execution: {kernelMs} ms</p>
        </div>
      </div>
    </div>
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
  memBox: {
    // display: 'flex',
    // alignItems: 'flex-start',
    // flexDirection: 'row',
    // flexWrap: 'nowrap',
    // fontSize: '0.9em',
  },
  dataPoint: {
    // flex: 1,
    // textAlign: 'center',
  },
};
