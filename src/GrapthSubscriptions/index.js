import gql from 'graphql-tag';

export const MY_DAOS_SUBSCRIPTION = address => gql`
  query {
    daos(orderBy: reputationHoldersCount, orderDirection: desc, first: 10) {
      id
      name
      reputationHoldersCount
      reputationHolders (
        where: {
   				address: "${address}"
				}
      ) {
    		address
  		}
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
