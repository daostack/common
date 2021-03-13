import React, {ReactElement, useEffect} from 'react';
import {WithNavigationRef} from '~/Types/navigation';
import {StackActionType} from '@react-navigation/native';

type Props = WithNavigationRef & {
	notificationRouting: StackActionType;
	setNotificationRouting: (value: null) => void;
}

const NotificationContainer = ({navigation, notificationRouting, setNotificationRouting}: Props): ReactElement => {

	useEffect(() => {
		if (navigation.current) {
            navigation.current?.dispatch(notificationRouting);
			setNotificationRouting(null);
		}
	}, [navigation]);

	return <></>;
};

export default NotificationContainer;
