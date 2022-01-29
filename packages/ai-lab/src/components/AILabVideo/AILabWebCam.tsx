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
import { useComponentSize } from '../../lib/hooks';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
};

export const AILabWebCam = ({
  model,
  modelConfig,
  ObjectDetectionUI = AILabObjectDetectionUI,
  onInference,
  perf,
  perfCallback,
  size = 224,
  visual,
  displaySize,
  active = true,
  style,
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

  async function tensorFlowIt(
    tensor: tf.Tensor3D,
    model: tf.GraphModel | tf.LayersModel
  ) {
    let res;
    if (modelConfig?.modelType === 'ssd') {
      if (results)
        tf.dispose([
          //@ts-ignore
          results[0],
          //@ts-ignore
          results[1],
        ]);

      res = await predictSSD(tensor, model);
    } else if (modelConfig?.modelType === 'pose') {
      // @ts-ignore
      res = await model.estimatePoses(tensor, {
        maxPoses: 1,
        flipHorizontal: false,
      });
    } else {
      if (results) tf.dispose(results);
      res = await predictClassification(tensor, model, size);
    }
    setResults(res);
    tensor.dispose(); // Cleanup GPU memory
  }

  async function setupVideo(useDevice: string) {
    if (stream.current) return;

    await listMediaDevices();

    const deviceId = useDevice ? { exact: useDevice } : undefined;

    const videoConstraints = {
      deviceId,
      width: { ideal: width, max: width },
      height: { ideal: height, max: height },
      facingMode: 'user', // rear facing if possible options === user, environment, left and right
    };

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
    tf.ready().then(() => {
      setIsTFReady(true);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const setupTFJS = async () => {
      tfCamera.current = await tf.data.webcam(myVideo.current!);
      async function handleDrawing() {
        if (!tfCamera.current) return;

        const tensor = await tfCamera.current.capture();
        await tensorFlowIt(tensor, model);
      }

      if (perf || perfCallback) {
        while (stream.current && active) {
          if (mounted) {
            const perfMetrics = await perfInfo(handleDrawing);

            if (perf) {
              setPerfProps(perfMetrics);
            }
            if (perfCallback) {
              perfCallback(perfMetrics);
            }
          }
        }
      } else {
        while (stream.current && active) {
          await handleDrawing();
        }
      }
    };

    if (isTFReady) {
      setupVideo(currentDevice).then(() => {
        setupTFJS();
      });
    }
    return () => {
      killVideo();
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

  const { height = 0, width = 0 } = useComponentSize(myVideo);

  return (
    <div style={style}>
      <div style={{ position: 'relative' }}>
        {perf && perfProps && !!drawingTime && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance {...perfProps} drawingTime={drawingTime} />
          </div>
        )}
        <video
          ref={myVideo}
          autoPlay
          height={displaySize === 'max' ? '100%' : '768px'}
          width={displaySize === 'max' ? '100%' : '1024px'}
        />
        {visual && (
          <ObjectDetectionUI
            detectionResults={detectionResults}
            height={myVideo.current?.offsetHeight ?? 0}
            modelConfig={{ ...defaultModelConfig, ...modelConfig }}
            onDrawComplete={(durationMs) => {
              if (!drawingTime) {
                setDrawingTime(durationMs);
              }
            }}
            width={myVideo.current?.offsetWidth ?? 0}
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
