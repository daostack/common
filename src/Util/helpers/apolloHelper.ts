import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {setContext} from 'apollo-link-context';
import {auth} from '~/Firebase';

enum QUERY_TYPE {
  SUBSCRIPTION =  'subscription',
  OPERATION_DEFINITION = 'OperationDefinition',
}
const APOLLO_URL = 'http://localhost:4000/graphql'; // TODO: Move to env
  const baseLink = new HttpLink({
    uri: uri || APOLLO_URL,
  });

  const withToken = setContext(async () => {
    const fireToken = await auth().currentUser.getIdToken(true);
    return {
      headers: {
        authorization: fireToken || token,
      },
    };
  });

  const httpLink = withToken.concat(baseLink as any) as any;


  const wsLink = new WebSocketLink({
    uri: `ws://${gqlUri}/graphql`,
    options: {
      reconnect: true,
      // connectionParams: {
      //   authToken: authToken,
      // },
    },
  });

  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === QUERY_TYPE.OPERATION_DEFINITION &&
        definition.operation === QUERY_TYPE.SUBSCRIPTION
      );
    },
    wsLink,
    httpLink,
  );



  return new ApolloClient({
    // ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: splitLink,
  });
};

export const apollo: ApolloClient<NormalizedCacheObject> = createApolloClient();
