import React, { useRef, useState } from 'react';
import { View, Button } from 'react-native';
import Video from 'react-native-video';
import Canvas from 'react-native-canvas';
import { launchImageLibrary } from 'react-native-image-picker';
import { VideoProps } from './types';

export const AILabNativeLocalVideo = ({  }: VideoProps) => {
  const canvasRef = useRef<Canvas>(null);
  const videoRef = useRef<Video>(null);
  const [uri, setURI] = useState<string>();

  async function getVideos() {
    launchImageLibrary(
      {
        mediaType: 'video',
      },
      res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.errorCode) {
          console.log('ImagePicker Error: ', res.errorCode);
        } else {
          setURI(res.assets?.[0]?.uri)
        }
      }
    );
  }

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <Canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />
        <Video source={{ uri }} ref={videoRef} controls />
        <Button title="Load Video" onPress={getVideos} />
      </View>
    </View>
  );
};
