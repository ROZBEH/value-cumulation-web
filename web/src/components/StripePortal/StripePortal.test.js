import { render } from '@redwoodjs/testing/web'

import StripePortal from './StripePortal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StripePortal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StripePortal />)
    }).not.toThrow()
  })
})
