import { render } from '@redwoodjs/testing/web'

import Verification from './Verification'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Verification', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Verification />)
    }).not.toThrow()
  })
})
