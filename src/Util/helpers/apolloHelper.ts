import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import {auth} from '~/Firebase';

export const createApolloClient = (uri: string, token?: string) => {
  const baseLink = new HttpLink({
    uri,
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
