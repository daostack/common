import {TabBar} from 'react-native-tab-view';
import React, {useState} from 'react';
import {View, Text} from 'react-native';

import TabBarIndicator from './TabBarIndicator';
import {layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const TabBarRenderer = (props) => {
  const [customNavigationState, setCustomNavigationState] = useState(props.navigationState);
  return (
    <TabBar
      ref={props.originRef}
      {...props}
      navigationState={customNavigationState}
      onTabLongPress={({route}) => {
        //const {navigationState} = props;
        //navigationState.index = route.index;
        //setCustomNavigationState(navigationState);
        props.jumpTo(route.index);
      }}
      renderIndicator={(indicator) => (
        <TabBarIndicator
          position={props.parentRef?.current?.props.position || indicator.position}
          navigationState={props.parentRef?.current?.props.navigationState || indicator.navigationState}
          getTabWidth={indicator.getTabWidth}
          width={indicator.width}
          style={indicator.style}
          layout={indicator.layout}
        />
      )}
      //props.navigationState.index === route.index
      renderLabel={({route, focused}) => {
        const isFocused = props.parentRef ? (props.navigationState.index === route.index) : focused;
        return <View style={{...layout.content, padding: 0}}>
          <Icon
            name={route.iconSelected && isFocused ? route.iconSelected : route.icon}
            size={30}
            color={isFocused ? colors.mainBlue : colors.grey3}
          />
        </View>;
      }}
      style={
        {
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
        }
      }
      tabStyle={{height: 76}}
    />
  );
};

export default TabBarRenderer;
