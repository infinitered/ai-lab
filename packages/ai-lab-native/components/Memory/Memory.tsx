import * as tf from '@tensorflow/tfjs';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface MemoryProps {
  pollingFrequency?: number;
}
export const Memory = ({ pollingFrequency = 1000 }: MemoryProps) => {
  const memoryInfo = tf.memory();
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTick(!tick), pollingFrequency);
    return () => clearInterval(timer);
  }, [pollingFrequency]);

  return (
    <>
      {Object.entries(memoryInfo).map(([key, value]) => {
        return (
          <Text key={key} style={{ color: '#fff' }}>{`${key}: ${value}`}</Text>
        );
      })}
    </>
  );
};
