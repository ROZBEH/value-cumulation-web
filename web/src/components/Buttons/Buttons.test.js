import { render } from '@redwoodjs/testing/web'

import Mapping from './Buttons'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Buttons', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Mapping />)
    }).not.toThrow()
  })
})
