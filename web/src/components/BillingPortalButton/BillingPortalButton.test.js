import { render } from '@redwoodjs/testing/web'

import BillingPortalButton from './BillingPortalButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BillingPortalButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BillingPortalButton />)
    }).not.toThrow()
  })
})
