import auth from '@react-native-firebase/auth';
import React, { PropsWithChildren } from 'react';
import { UserInfo } from '~/Types/store';

interface IAuthContext {
    token?: string | null;
    loaded: boolean;
    userInfo?: UserInfo | null;
    authenticated?: boolean;
}

const defaultAppContext: IAuthContext = {
    loaded: false,
};

const AuthContext = React.createContext<IAuthContext>(defaultAppContext);

export const useAuthContext = () => React.useContext<IAuthContext>(AuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
    const [context, setContext] = React.useState<IAuthContext>(defaultAppContext);

    React.useEffect(
        () =>
            auth().onIdTokenChanged(async user => {
                if (user) {
                    const token = await user.getIdToken();

                    setContext(prevContext => ({
                        ...prevContext,

                        token,
                        loaded: true,
                        userInfo: user,
                        authenticated: true,
                    }));
                } else {
                    setContext(prevContext => ({
                        ...prevContext,

                        token: null,
                        loaded: true,
                        userInfo: null,
                        authenticated: false,
                    }));
                }
            }),
        [],
    );

    return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};
