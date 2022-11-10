import { render } from '@redwoodjs/testing/web'

import BillingPortal from './BillingPortal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BillingPortal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BillingPortal />)
    }).not.toThrow()
  })
})
