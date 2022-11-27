import { render } from '@redwoodjs/testing/web'

import Userformula from './Userformula'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Userformula', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Userformula />)
    }).not.toThrow()
  })
})
