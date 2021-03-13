import {useEffect} from 'react';
import {inject, observer} from 'mobx-react';

const NotificationContainer = ({navigation, notificationRouting, setNotificationRouting}) => {

	useEffect(() => {
		if (navigation.current) {
            navigation.current.dispatch(notificationRouting);
			setNotificationRouting(null);
		}
	}, [navigation]);
};

export default inject('rootStore')(observer(NotificationContainer));
