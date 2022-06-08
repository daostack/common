// test-utils.jsx
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import {render as rtlRender} from '@testing-library/react-native';
import {Provider} from 'mobx-react';
import stores from '~/Stores';

export function render(
  ui,
  {preloadedState, initialState, ...renderOptions} = {},
) {
  function Wrapper({children}) {
    return <Provider {...stores}>{children}</Provider>;
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
}
