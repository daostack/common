import {ApolloClient as OriginalApolloClient, NormalizedCacheObject} from '@apollo/client';
import {createApolloClient} from '~/Util/helpers/apolloHelper';

export default class ApolloClient {
    static clientInstance: OriginalApolloClient<NormalizedCacheObject> | null = null;

    static getInstance = () => {
      if (ApolloClient.clientInstance == null) {
        ApolloClient.clientInstance = createApolloClient('http://localhost:4000/graphql');
      }
      return ApolloClient.clientInstance;
    };

}
