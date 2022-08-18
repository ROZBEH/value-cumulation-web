import { render } from '@redwoodjs/testing/web'

import Financials from './Financials'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Financials', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Financials />)
    }).not.toThrow()
  })
})
