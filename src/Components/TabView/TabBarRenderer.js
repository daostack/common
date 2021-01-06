import {TabBar} from 'react-native-tab-view';
import React from 'react';
import {View, Platform} from 'react-native';
import TabBarIndicator from './TabBarIndicator';
import {layout, colors} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {func, object, shape, number, array} from 'prop-types';

const TabBarRenderer = ({
  originRef,
  parentRef,
  navigationState,
  indexChange,
  ...props
}) => (
  <TabBar
    ref={originRef}
    {...props}
    navigationState={navigationState}
    onTabLongPress={({route}) => {
      Platform.OS === 'android' && indexChange(route.index);
    }}
    renderIndicator={(indicator) => (
      <TabBarIndicator
        position={parentRef?.current?.props.position || indicator.position}
        navigationState={
          parentRef?.current?.props.navigationState || indicator.navigationState
        }
        getTabWidth={indicator.getTabWidth}
        width={indicator.width}
        style={indicator.style}
        indicatorLayout={indicator.layout}
      />
    )}
    renderLabel={({route, focused}) => {
      const isFocused = parentRef
        ? navigationState.index === route.index
        : focused;
      return (
        <View style={{...layout.content, padding: 0}}>
          <Icon
            name={
              route.iconSelected && isFocused ? route.iconSelected : route.icon
            }
            size={30}
            color={isFocused ? colors.mainBlue : colors.grey3}
          />
        </View>
      );
    }}
    style={{
      backgroundColor: colors.white,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      elevation: 2,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: {
        height: 3,
        width: 0,
      },
      zIndex: 1,
    }}
    tabStyle={{height: 76}}
  />
);

TabBarRenderer.propTypes = {
  originRef: object,
  parentRef: object,
  navigationState: shape({
    index: number,
    routes: array,
  }),
  indexChange: func,
  otherProps: object,
};

export default TabBarRenderer;
