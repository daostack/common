# Common!

![Build Android and iOS](https://github.com/daostack/common/workflows/Build%20Android%20and%20iOS/badge.svg)
[![Build Status](https://app.bitrise.io/app/9fc9ceef54ad43fc/status.svg?token=gXG1PVCISnISuX4rCSrESw&branch=master)](https://app.bitrise.io/app/9fc9ceef54ad43fc)

A DAOstack Product

## Getting Started

For Getting Started with React Native there is a very comprehensive guide on their website

https://reactnative.dev/docs/getting-started

There are two documentation options: Expo CLI Quickstart & React Native CLI Quickstart.

Choose the React Native CLI Quickstart and then choose whether you use a Mac, Linux or Windows

### Files containing keys

You will need three files

1.  For React Native - `env.json`
2.  For iOS `GoogleService-Info.plist`
3.  For Android `google-services.json`

To get started you should ask one of the members of the developer for those files.

The `env.json` is to be placed into the root folder of the React Native project.

The `GoogleService-Info.plist` is to be placed in the `ios/firebase/${ENV_FOLDER_NAME}/` and `google-services.json` file is to be placed in the `/android/app/src/${ENV_FOLDER_NAME}` where ENV_FOLDER_NAME is the specific env folder name (production or staging). If folders do not exist, create them.

### Getting Started from the Common Github Repo

1. Clone the repo `git clone https://github.com/daostack/common.git`
2. `cd common` and run `yarn`
3. `cd ios` and run `pod install`
4. To run the application go back to the root of the project and run `yarn ios:staging` for iOS or `yarn android:staging` for Android
5. To use test credit card details, run `yarn useTestCard`, to use your own credit card details, cancel test card by running `yarn useRealCard`.

If the project doesn't run there may be a few reasons.

The most common is:

Replace the sdk.dir path to match your environment of the file `android/local.properties`

in Windows `sdk.dir = C:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk`

in macOS `sdk.dir = /Users/USERNAME/Library/Android/sdk`

in linux `sdk.dir = /home/USERNAME/Android/Sdk`

Or this error `package android.support.annotation does not exist`

Please enter command `npx jetify` in terminal. [StackOverflow](https://stackoverflow.com/questions/53235525/issues-using-androidx-and-react-native)

### Documentation

[iconfont](./doc/icon.md)

[Code Push](./doc/codepush.md)

### Useful Download links

##### Android Studio

https://developer.android.com/studio

##### Xcode

https://apps.apple.com/us/app/xcode/id497799835?mt=12

### Useful links for libraries used in the Project

##### Navigation (React Navigation)

https://reactnavigation.org/docs/bottom-tab-navigator

##### Testing (Jest)

https://jestjs.io/

##### React Native Firebase

https://rnfirebase.io/

##### React Hooks

https://reactjs.org/docs/hooks-intro.html
