import React from 'react';
import {Text, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AILabNativeImage} from 'ai-lab-native';

const App = () => {
  try {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AILabNativeImage source={require('./storybook/dinner.jpg')} />
      </SafeAreaView>
    );
  } catch (e) {
    console.log((e as any).message);
    return (
      <SafeAreaView>
        <Text>What's going on?</Text>
      </SafeAreaView>
    );
  }
};

export default App;
