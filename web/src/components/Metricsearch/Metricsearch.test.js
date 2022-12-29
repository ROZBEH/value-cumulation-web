import { render } from '@redwoodjs/testing/web'

import Metricsearch from './Metricsearch'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Metricsearch', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Metricsearch />)
    }).not.toThrow()
  })
})
