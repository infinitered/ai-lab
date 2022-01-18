import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, perfInfo, PerformanceInfo } from '../../performance';
import { Devices } from './Devices';
import { VideoProps, ModelConfig, Results } from '../../types';
import {
  getInferenceData,
  getModelDetections,
  predictClassification,
  predictSSD,
} from '../../lib/helpers';
import { AILabObjectDetectionUI } from '..';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
  labels: [],
};

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const AILabWebCam = ({
  model,
  modelConfig,
  ObjectDetectionUI = AILabObjectDetectionUI,
  onInference,
  perf,
  perfCallback,
  size = 224,
  visual,
}: VideoProps) => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const stream: React.MutableRefObject<MediaStream | null> =
    useRef<MediaStream>(null);
  const tfCamera: React.MutableRefObject<any> = useRef(null);
  const [isTFReady, setIsTFReady] = useState(false);
  const [devices, setDevices] = useState(null);
  const [currentDevice, setCurrentDevice] = useState(
    localStorage.getItem('currentDevice') || ''
  );
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [drawingTime, setDrawingTime] = useState(0);
  const [detectionResults, setDetectionResults] = useState<any>({});
  const [results, setResults] = useState<Results>();

  const maxWidth = window.innerWidth - 18; // subtract scrollbar
  const maxHeight = window.innerHeight;

  async function tensorFlowIt(
    tensor: tf.Tensor3D,
    model: tf.GraphModel | tf.LayersModel
  ) {
    if (modelConfig?.modelType === 'ssd') {
      if (results)
        tf.dispose([
          //@ts-ignore
          results[0],
          //@ts-ignore
          results[1],
        ]);

      const res = await predictSSD(tensor, model);
      setResults(res);
    } else {
      if (results) tf.dispose(results);
      const res = await predictClassification(tensor, model, size);
      setResults(res);
    }
  }

  async function setupVideo(useDevice: string) {
    if (stream.current) return;

    listMediaDevices();

    const deviceId = useDevice ? { exact: useDevice } : undefined;

    const videoConstraints = {
      deviceId,
      width: { ideal: maxWidth, max: maxWidth },
      height: { ideal: maxHeight, max: maxHeight },
      facingMode: 'user', // rear facing if possible options === user, environment, left and right
    };
    myVideo.current!.width = maxWidth;
    myVideo.current!.height = maxHeight;

    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints,
      });
      stream.current = vidStream;

      if ('srcObject' in myVideo.current!) {
        myVideo.current!.srcObject = vidStream;
      } else {
        myVideo.current!.src = window.URL.createObjectURL(vidStream as any);
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
    stream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    if (myVideo.current) myVideo.current.srcObject = null;
    stream.current = null;
    tfCamera.current?.stop();
    // canvasRef.current
    //   ?.getContext('2d')
    //   ?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  }

  async function listMediaDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((dev) => dev.kind === 'videoinput');
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
    let mounted = true;

    const setupTFJS = async () => {
      tfCamera.current = await tf.data.webcam(myVideo.current!);
      async function handleDrawing() {
        if (!tfCamera.current) return;
        const tensor = await tfCamera.current.capture();
        tensorFlowIt(tensor, model);
      }

      if (perf || perfCallback) {
        while (stream.current) {
          if (mounted) {
            const perfMetrics = await perfInfo(handleDrawing);

            if (perf) {
              setPerfProps(perfMetrics);
            }
            if (perfCallback) {
              perfCallback(perfMetrics);
            }
            await delay(1000);
          }
        }
      } else {
        while (stream.current) {
          await handleDrawing();
          await delay(1000);
        }
      }
    };

    if (isTFReady) {
      setupTFJS();
      setupVideo(currentDevice);
    }
    return () => {
      mounted = false;
    };
  }, [isTFReady]);

  useEffect(() => {
    (async function () {
      if (results) {
        const detections = await getModelDetections(results, modelConfig);
        const inferences = await getInferenceData(detections, modelConfig);
        setDetectionResults(detections);
        onInference?.(inferences);
      }
    })();
  }, [modelConfig, results]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {perf && perfProps && !!drawingTime && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance {...perfProps} drawingTime={drawingTime} />
          </div>
        )}
        <video ref={myVideo} autoPlay />
        {visual && (
          <ObjectDetectionUI
            detectionResults={detectionResults}
            height={myVideo.current?.height ?? 0}
            modelConfig={{ ...defaultModelConfig, ...modelConfig }}
            onDrawComplete={(durationMs) => {
              if (!drawingTime) {
                setDrawingTime(durationMs);
              }
            }}
            width={myVideo.current?.width ?? 0}
          />
        )}
      </div>
      <div>
        <Devices
          select={currentDevice}
          devices={devices}
          onChange={changeDevice}
        />
        <button onClick={killVideo}>Stop WebCam</button>
      </div>
    </div>
  );
};
