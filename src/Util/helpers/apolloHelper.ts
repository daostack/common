import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import {auth} from '~/Firebase';

const APOLLO_URL = 'http://localhost:4000/graphql'; // TODO: Move to env

export const createApolloClient = (uri?: string, token?: string) => {
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

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: withToken.concat(baseLink as any) as any,
  });
};

export const apollo: ApolloClient<NormalizedCacheObject> = createApolloClient();
