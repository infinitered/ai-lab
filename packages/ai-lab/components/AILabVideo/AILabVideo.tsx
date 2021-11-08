import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, PerformanceProps } from '../../performance';
import { Devices } from './Devices';
import { CLASSES } from '../labels';

export interface VideoProps
  extends React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    PerformanceProps {}

export const AILabVideo = ({ perf, perfCallback, ...props }: VideoProps) => {
  const mirror = useRef(null);
  const [isTFReady, setIsTFReady] = useState(false);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState(null);
  const [currentDevice, setCurrentDevice] = useState(
    localStorage.getItem('currentDevice') || ''
  );
  const [mirrored, setMirrored] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';
  const maxWidth = window.innerWidth - 18; // subtract scrollbar
  const maxHeight = window.innerHeight;
  let video: HTMLVideoElement;

  async function tensorFlowIt(video: HTMLVideoElement, model: tf.GraphModel) {
    const cam = await tf.data.webcam(video);
    const img = await cam.capture();
    // img.print();
    const readyfied = tf.expandDims(img, 0);
    const results = await model.executeAsync(readyfied);

    // Prep Canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';

    // Get a clean tensor of top indices
    const detectionThreshold = 0.4;
    const iouThreshold = 0.5;
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
    //   tensor,
    //   readyfied,
    //   justBoxes,
    //   justValues,
    // ]);

    //Drawing starts
    // let start = performance.now();

    for (const detection of chosen) {
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
      // setDrawingTime(performance.now() - start);
    }
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
    video = mirror.current;
    video.width = maxWidth;
    video.height = maxHeight;

    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints,
      });
      setStream(vidStream); // store for cleanup

      const videoInputs = vidStream.getVideoTracks();
      console.log(`The video device you are using is ${videoInputs[0].label}`);

      if ('srcObject' in video) {
        video.srcObject = vidStream;
      } else {
        video.src = window.URL.createObjectURL(vidStream);
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
    stream &&
      stream.getTracks().forEach(track => {
        track.stop();
      });
  }

  async function listMediaDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(dev => dev.kind === 'videoinput');
    setDevices(videoDevices);
  }

  async function changeDevice(dd) {
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
      // if (perf || perfCallback) {
      //   const perfMetrics = await perfInfo(async () => {
      //     await tensorFlowIt(model);
      //   });
      //   if (perf) {
      //     setPerfProps(perfMetrics);
      //   }
      //   if (perfCallback) {
      //     perfCallback(perfMetrics);
      //   }
      // } else {
      tensorFlowIt(video, model);
      // }
    };

    if (isTFReady) {
      setupTFJS();
      setupVideo(currentDevice);
      // cleanup is returned
      return killVideo;
    }
  }, [isTFReady]);

  return (
    <div>
      <main style={{ position: 'relative' }}>
        <video
          ref={mirror}
          id="mirror"
          className={mirrored ? 'mirrored' : ''}
          autoPlay
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
        />
      </main>
      <div>
        <button onClick={() => setMirrored(m => !m)}>
          {mirrored ? 'Mirrored' : 'Unmirrored'}
        </button>
        <Devices
          select={currentDevice}
          devices={devices}
          onChange={changeDevice}
        />
      </div>
    </div>
  );
};
