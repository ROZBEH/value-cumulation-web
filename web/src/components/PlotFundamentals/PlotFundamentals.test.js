import { render } from '@redwoodjs/testing/web'

import PlotFundamentals from './PlotFundamentals'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PlotFundamentals', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlotFundamentals />)
    }).not.toThrow()
  })
})
