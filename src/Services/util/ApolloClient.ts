import {
  ApolloClient as OriginalApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import {createApolloClient} from '~/Util/helpers/apolloHelper';
// import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
// import {WebSocketLink} from '@apollo/client/link/ws';

const QGL_URL = 'https://api.staging.common.io';

export default class ApolloClient {
  static clientInstance: OriginalApolloClient<NormalizedCacheObject> | null = null;

  static getInstance = () => {
    if (ApolloClient.clientInstance == null) {
      ApolloClient.clientInstance = createApolloClient(QGL_URL);
    }
    return ApolloClient.clientInstance;
  };
}

// const wsLink = new WebSocketLink({
//   uri: `ws://${QGL_URL}/subscriptions`,
//   options: {
//     reconnect: true,
//   },
// });

// const networkInterface = createNetworkInterface({ uri: QGL_URL });

// networkInterface.use([{
//   applyMiddleware(req, next) {
//     setTimeout(next, 500);
//   },
// }]);

// const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
//   reconnect: true,
// });

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient,
// );
