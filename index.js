/** @format */
import 'react-native-gesture-handler'
import {AppRegistry} from 'react-native';
import Wrapper from './Wrapper';
import {name as appName} from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => Wrapper);
