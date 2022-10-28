import { render } from '@redwoodjs/testing/web'

import Product from './Product'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Product', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Product />)
    }).not.toThrow()
  })
})
