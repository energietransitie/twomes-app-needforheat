// /* eslint-disable no-undef, import/no-extraneous-dependencies */

// // Import Jest Native matchers
// import "@testing-library/jest-native/extend-expect";

// // Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");
jest.mock("@react-native-firebase/dynamic-links");
jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation.js");
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper.js");
jest.useFakeTimers("legacy");
// // Setup Reanimated mocking for Drawer navigation
// global.ReanimatedDataMock = { now: () => Date.now() };
// // require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
