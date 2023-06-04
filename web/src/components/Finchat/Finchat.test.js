import { render } from '@redwoodjs/testing/web'

import Finchat from './Finchat'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Finchat', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Finchat />)
    }).not.toThrow()
  })
})
