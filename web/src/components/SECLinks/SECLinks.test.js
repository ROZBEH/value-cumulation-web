import { render } from '@redwoodjs/testing/web'

import SecLinks from './SecLinks'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SecLinks', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SecLinks />)
    }).not.toThrow()
  })
})
