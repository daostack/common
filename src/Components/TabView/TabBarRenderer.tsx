import {TabBar, TabBarProps} from 'react-native-tab-view';
import React from 'react';
import {View, Platform} from 'react-native';
import TabBarIndicator from './TabBarIndicator';
import {layout, colors} from '~/Theme';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';

export const TabBarRenderer = ({
  navigationState,
  indexChange,
  parentRef,
  ...props
}: TabBarProps<{
  key: string;
  icon: IconNames;
  iconSelected: IconNames;
  title?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  index: number;
}> & {
  parentRef?: React.RefObject<TabBarIndicator>;
  indexChange(index: number): void;
}) => (
  <TabBar
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
