export const QUERY = gql`
  query GetFundamentalsQuery($ticker: String!) {
    fundamentals: getFundamental(ticker: $ticker) {
      ticker
      intrinsic_value
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ fundamentalanalysis }) => {
  return <div>{JSON.stringify(fundamentalanalysis)}</div>
}
