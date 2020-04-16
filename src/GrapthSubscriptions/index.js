import gql from 'graphql-tag';

export const ALL_DAOS_SUBSCRIPTION = (address) => gql`
  query {
    daos(orderBy: reputationHoldersCount, orderDirection: desc) {
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

export const MY_DAOS_SUBSCRIPTION = () => gql`
  query myDaos($address: String!) {
    reputationHolders(where: {address: $address}) {
      address
      dao {
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
          proposer
        }
      }
    }
  }
`;
