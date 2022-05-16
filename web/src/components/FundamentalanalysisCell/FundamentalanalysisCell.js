export const QUERY = gql`
  query GetFundamentalsQuery($ticker: String!) {
    fundamentalanalysis: getFundamental(ticker: $ticker) {
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
  return (
    <section>
      <h1>{fundamentalanalysis.ticker}</h1>
      <h2>Intrinsic Value: {fundamentalanalysis.intrinsic_value}</h2>
    </section>
  )
}
