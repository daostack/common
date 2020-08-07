import { TabBar} from 'react-native-tab-view';
import React, {useState} from 'react';
import {View} from 'react-native';

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
      onTabPress={(currRoute) => {
        // if there is a parentRef prop then, that's a copy of the tabBar and it's user for appearing as a sticky header for the tabView
        if (props.parentRef) {
          currRoute.preventDefault();
          const parentProps = props.parentRef?.current?.props;
          setCustomNavigationState(parentProps.navigationState);
          props.parentRef.current?.props.jumpTo(currRoute.route.key);
          //props.parentRef.current?.resetScroll(parentProps.navigationState.index);
        }
      }}
      renderIndicator={(indicator) => {
        return (
          <TabBarIndicator
            position={props.parentRef?.current?.props.position || indicator.position}
            navigationState={props.parentRef?.current?.props.navigationState || indicator.navigationState}
            getTabWidth={indicator.getTabWidth}
            width={indicator.width}
            style={indicator.style}
            layout={indicator.layout}
          />
        );
      }}

      renderLabel={(label, focused) => {
        return (
          <View style={{...layout.content, padding: 0}}>
            <Icon
              name={label.route.iconSelected && label.focused ? label.route.iconSelected : label.route.icon}
              size={30}
              color={label.focused ? colors.mainBlue : colors.grey3}
            />
          </View>
        );
      }}
      style={
        {
          backgroundColor: colors.white,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,

          elevation: 4,
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: {
            height: 3,
            width: 0,
          },
          zIndex: 1,
          elevation: 2,
        }
      }
      tabStyle={{height: 76}}
    />
  );
};

export default TabBarRenderer;
