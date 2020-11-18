# Migrate to TypeScript

### Converting
To simplify migration we using [react-js-to-ts]. This tool is:

### Usage

Installation
```
yarn global add react-js-to-ts
```
Then simply pass filepath to get converted `ts/tsx` file in the same folder:
```
react-js-to-ts  src/Components/Commons/RequestToJoinRule.js
```
> Note: That original js file will be removed even if script finished with exception 

### Description
Proxies PropTypes to React.Component generic type and removes PropTypes. But you should also take a look that it using deprecated  `SFC` type, after applying this tool to React component you should change type of your compnent from `SFC` to `FC`. And you should also cast props of your component to generated type as it doesn't make automatically.
Provides state typing for React.Component based on initial state and setState() calls in the component
Hoist large interfaces for props and state out of React.Component<P, S> into decThe lared types
Convert functional components with PropTypes property to TypeScript and uses propTypes to generate function type declaration

This tool is not working with ES6 optional properties and you can see an exceptions. This can be fixed by temporary removing `?` from constructions like `object?.myProp` and applying it again after file will be generated. 