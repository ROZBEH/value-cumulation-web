import { render } from '@redwoodjs/testing/web'

import Sector from './Sector'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Sector', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Sector />)
    }).not.toThrow()
  })
})
