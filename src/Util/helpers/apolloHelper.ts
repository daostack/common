import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import {auth} from '~/Firebase';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {getGraphqlApiUrl, isGraphqlApiUseSsl} from '~/Config';

enum QUERY_TYPE {
  SUBSCRIPTION = 'subscription',
  OPERATION_DEFINITION = 'OperationDefinition',
}
const APOLLO_URL = `${getGraphqlApiUrl()}:4000`;
const APOLLO_URL_USE_SSL = isGraphqlApiUseSsl();

export const createApolloClient = (gqlUri: string, token?: string) => {
  const baseLink = new HttpLink({
    uri: `${APOLLO_URL_USE_SSL ? 'https' : 'http'}://${gqlUri}/graphql`,
  });

  const withToken = setContext(async () => {
    const fireToken = await auth().currentUser?.getIdToken(true);
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

export const apollo: ApolloClient<NormalizedCacheObject> =
  createApolloClient(APOLLO_URL);
