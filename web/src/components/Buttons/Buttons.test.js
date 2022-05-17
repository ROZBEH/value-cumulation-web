import { render } from '@redwoodjs/testing/web'

import Buttons from './Buttons'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Buttons', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Buttons />)
    }).not.toThrow()
  })
})
