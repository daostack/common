import React, {PropsWithChildren} from 'react';

import {ApolloProvider as BareApolloProvider} from '@apollo/client';
import {useApollo} from '~/Util/hooks';
import {useAuthContext} from '~/Context/AuthContext';

export const ApolloProvider: React.FC<PropsWithChildren<any>> = ({
  // eslint-disable-next-line react/prop-types
  children,
  ...rest
}) => {
  const authContext = useAuthContext();
  const apollo = useApollo(
    'http://localhost:4000/graphql' || '',
    authContext.token || '',
  );

  return (
    <BareApolloProvider client={apollo}>
      {React.isValidElement(children) &&
        React.cloneElement(children, {...rest})}
    </BareApolloProvider>
  );
};
