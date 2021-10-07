import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import {offsetLimitPagination} from '@apollo/client/utilities';
import {setContext} from 'apollo-link-context';
import {auth} from '~/Firebase';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {getGraphqlApiUrl, isGraphqlApiUseSsl} from '~/Config';

enum QUERY_TYPE {
  SUBSCRIPTION = 'subscription',
  OPERATION_DEFINITION = 'OperationDefinition',
}
const APOLLO_URL = getGraphqlApiUrl();
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

  const subscriptionClient = new SubscriptionClient(`ws://${gqlUri}/graphql`, {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const fireToken = await auth().currentUser?.getIdToken(true);

      return {
        authorization: fireToken || token,
      };
    },
  });

  const webSocketLink = new WebSocketLink(subscriptionClient);

  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === QUERY_TYPE.OPERATION_DEFINITION &&
        definition.operation === QUERY_TYPE.SUBSCRIPTION
      );
    },
    webSocketLink,
    httpLink,
  );

  return new ApolloClient({
    // ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            discussions: offsetLimitPagination(),
          },
        },
      },
    }),
    link: splitLink,
  });
};

export const apollo: ApolloClient<NormalizedCacheObject> =
  createApolloClient(APOLLO_URL);
