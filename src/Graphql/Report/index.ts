import {gql} from '@apollo/client';
export * from './ReportType';

const gqlReportProps = `
    id
  `;

export const CreateReportDocument = gql`
  mutation CreateReport(
    $input: CreateReportInput!
  ) {
    createReport(input: $input) {
      ${gqlReportProps}
    }
  }
`;
