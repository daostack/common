import gql from 'graphql-tag';

export const DAOS_SUBSCRIPTION = gql`
  query {
    daos(orderBy: reputationHoldersCount, orderDirection: desc, first: 10) {
      id
      name
      reputationHoldersCount
      schemes(first: 1000) {
        id
        address
        name
        paramsHash
      }
      proposals(first: 1000) {
        id
        stage
      }
    }
  }
`;
