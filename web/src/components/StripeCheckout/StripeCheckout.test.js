import { render } from '@redwoodjs/testing/web'

import StripeCheckout from './StripeCheckout'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StripeCheckout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StripeCheckout />)
    }).not.toThrow()
  })
})
