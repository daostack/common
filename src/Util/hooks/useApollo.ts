import React from 'react';
import { createApolloClient } from '../helpers/apolloHelper';

export const useApollo = (uri: string, token?: string) =>
    React.useMemo(() => createApolloClient(uri, token), [uri, token]);
