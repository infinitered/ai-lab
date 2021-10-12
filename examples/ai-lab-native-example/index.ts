/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import {StorybookUIRoot as App} from 'ai-lab-native-storybook';

AppRegistry.registerComponent(appName, () => App);
