import * as tf from '@tensorflow/tfjs';
import { ProfileInfo } from '@tensorflow/tfjs-core/dist/engine';
import React from 'react';
import { Memory } from './Memory';

const numberWithCommas = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatKB = (bytes: number) => numberWithCommas(Math.round(bytes / 1024));

export type PerformanceInfo = ProfileInfo &
  tf.TimingInfo & { drawingTime?: number } & { fps?: number };

export interface PerformanceProps {
  perf?: boolean;
  perfCallback?: (perf: PerformanceInfo) => any;
}

export const perfInfo = async (callback: () => void | Promise<void>) => {
  let timeInfo: tf.TimingInfo = { kernelMs: 0, wallMs: 0 };
  const profileInfo = await tf.profile(async () => {
    timeInfo = await tf.time(callback);
  });

  return { ...profileInfo, ...timeInfo };
};

export const Performance = ({
  peakBytes,
  newBytes,
  newTensors,
  kernelMs,
  drawingTime,
  fps,
}: PerformanceInfo) => {
  return (
    //checkout the bottom left corner on the screen to see the metrics boxes
    <div>
      <div style={styles.container}>
        <p>New Bytes: {formatKB(newBytes)} KB </p>
        <p>New Tensors: {newTensors}</p>
        <p>Peak Bytes: {formatKB(peakBytes < 0 ? 0 : peakBytes)} KB</p>
        <p>Execution: {kernelMs} ms</p>
        {!!drawingTime && <p>Drawing Time: {drawingTime.toFixed(2)} ms</p>}
        {!!fps && <p>FPS: {fps}</p>}
      </div>
      <div style={styles.container}>
        <Memory pollingFrequency={1000} />
      </div>
    </div>
  );
};

Performance.perfInfo = perfInfo;

const styles = {
  container: {
    backgroundColor: '#3f4255',
    borderColor: '#44475c',
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
    margin: 20,
    opacity: '0.8',
    padding: 10,
    width: '20%',
    fontFamily: 'sans-serif',
  },
};
