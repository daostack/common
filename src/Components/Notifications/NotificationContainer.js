import {useEffect} from 'react';
import {inject, observer} from 'mobx-react';

const NotificationContainer = ({navigation, notificationRouting}) => {

	useEffect(() => {
		if (navigation.current) {
      navigation.current.dispatch(notificationRouting);
		}
	}, [navigation]);
};

export default inject('rootStore')(observer(NotificationContainer));
