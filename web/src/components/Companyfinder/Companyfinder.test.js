import { render } from '@redwoodjs/testing/web'

import Companyfinder from './Companyfinder'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Companyfinder', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Companyfinder />)
    }).not.toThrow()
  })
})
