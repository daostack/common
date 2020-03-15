# Common!

A DAOstack product

## Getting Started
For Getting Started with React Native there is a very comprehensive guide on their website

https://reactnative.dev/docs/getting-started

There are two documentation options: Expo CLI Quickstart & React Native CLI Quickstart.

Choose the React Native CLI Quickstart and then choose whether you use a Mac, Linux or Windows

### Files containing keys
You will need the `env.json` file from one of the members of the developer team to get started.
This file is to be placed into the root folder of the project.

### Getting Started from the Common Github Repo

1. Clone the repo `git clone https://github.com/daostack/common.git`
2. `cd common` and run `yarn` or `npm install`
3. `cd ios` and run `pod install`

### For iOS

4. To run the project from the command line run `react-native run-ios`
5. To run from Xcode, open the `common.xcworkspace` file and then enter `command + r`

### For Android

6. Run an Android simulator device
7. Enter `react-native run-android` in the command line

If the project doesn't run there may be a few reasons.

The most common is:

Replace the sdk.dir path to match your environment of the file `android/local.properties`

in Windows `sdk.dir = C:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk`

in macOS `sdk.dir = /Users/USERNAME/Library/Android/sdk`

in linux `sdk.dir = /home/USERNAME/Android/Sdk`

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



