import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  Performance,
  PerformanceProps,
  perfInfo,
  PerformanceInfo,
} from '../../performance';
import { Devices } from './Devices';
import { CLASSES } from '../labels';

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}

const delay = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const AILabWebCam = ({ perf, perfCallback }: VideoProps) => {
  const myVideo = useRef(null);
  const [isTFReady, setIsTFReady] = useState(false);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState(null);
  const [currentDevice, setCurrentDevice] = useState(
    localStorage.getItem('currentDevice') || ''
  );
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [drawingTime, setDrawingTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';
  const maxWidth = window.innerWidth - 18; // subtract scrollbar
  const maxHeight = window.innerHeight;
  let video: HTMLVideoElement | undefined = void 0;

  async function tensorFlowIt(img: tf.Tensor3D, model: tf.GraphModel) {
    const readyfied = tf.expandDims(img, 0);
    const results = (await model.executeAsync(readyfied)) as tf.Tensor<tf.Rank>[];

    // Prep Canvas
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
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

    //Drawing starts
    let start = performance.now();

    for (const detection of chosen as any) {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 4;
      ctx.globalCompositeOperation = 'destination-over';
      const detectedIndex = maxIndices[detection];
      const detectedClass = CLASSES[detectedIndex];
      const detectedScore = scores[detection];
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * maxHeight : 0;
      const startX = dBox[1] > 0 ? dBox[1] * maxWidth : 0;
      const boxHeight = (dBox[2] - dBox[0]) * maxHeight;
      const boxWidth = (dBox[3] - dBox[1]) * maxWidth;
      ctx.strokeRect(startX, startY, boxWidth, boxHeight);
      // Draw the label background.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0B0';
      const textHeight = 16;
      const textPad = 4;
      const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(label, startX, startY);

      // Drawing ends
      setDrawingTime(performance.now() - start);
    }

    //Preventing memory leak when it's repainted over and over
    tf.dispose([
      results[0],
      results[1],
      // model,
      nmsDetections.selectedIndices,
      nmsDetections.selectedScores,
      prominentDetection.indices,
      prominentDetection.values,
      img,
      readyfied,
      justBoxes,
      justValues,
    ]);
  }

  async function setupVideo(useDevice: string) {
    listMediaDevices();

    const deviceId = useDevice ? { exact: useDevice } : null;

    const videoConstraints = {
      deviceId,
      width: { ideal: maxWidth, max: maxWidth },
      height: { ideal: maxHeight, max: maxHeight },
      facingMode: 'environment', // rear facing if possible options === user, environment, left and right
    };
    video = myVideo.current as unknown as HTMLVideoElement;
    video.width = maxWidth;
    video.height = maxHeight;

    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints,
      } as any);
      setStream(vidStream as any); // store for cleanup

      const videoInputs = vidStream.getVideoTracks();
      console.log(`The video device you are using is ${videoInputs[0].label}`);

      if ('srcObject' in video) {
        video.srcObject = vidStream;
      } else {
        (video as HTMLVideoElement).src = window.URL.createObjectURL(vidStream);
      }
    } catch (e) {
      localStorage.clear();
      alert(
        "Something went wrong for this device!  Please change browsers, try again, or contribute to the site's open source!"
      );
      console.log(e);
    }
  }

  function killVideo() {
      (stream as any)?.getTracks().forEach((track: any) => {
        track.stop();
      });
  }

  async function listMediaDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(dev => dev.kind === 'videoinput');
    setDevices(videoDevices as any);
  }

  async function changeDevice(dd: any) {
    setCurrentDevice(dd);
    // store for next time
    localStorage.setItem('currentDevice', dd);
    killVideo();
    setupVideo(dd);
  }

  useEffect(() => {
    tf.ready().then(() => setIsTFReady(true));
  }, []);

  useEffect(() => {
    const setupTFJS = async () => {
      const model = await tf.loadGraphModel(modelPath);
      const cam = await tf.data.webcam(video);
      async function handleDrawing() {
        const img = await cam.capture();
        tensorFlowIt(img, model);
      }

      if (perf || perfCallback) {
        while (true) {
          const perfMetrics = await perfInfo(handleDrawing);

          if (perf) {
            setPerfProps(perfMetrics);
            await delay(1000);
          }
          if (perfCallback) {
            perfCallback(perfMetrics);
          }
        }
      } else {
        while (true) {
          await handleDrawing();
          await delay(1000);
        }
      }
    };
    if (isTFReady) {
      setupTFJS();
      setupVideo(currentDevice);
      // cleanup is returned
      // return killVideo;
    }
  }, [isTFReady]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <video ref={myVideo} autoPlay />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />
        {perf && perfProps && !!drawingTime && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance {...perfProps} drawingTime={drawingTime} />
          </div>
        )}
      </div>
      <div>
        <Devices
          select={currentDevice}
          devices={devices}
          onChange={changeDevice}
        />
      </div>
    </div>
  );
};
