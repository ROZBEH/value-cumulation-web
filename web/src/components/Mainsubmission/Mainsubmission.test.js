import { render } from '@redwoodjs/testing/web'

import Mainsubmission from './Mainsubmission'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Mainsubmission', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Mainsubmission />)
    }).not.toThrow()
  })
})
