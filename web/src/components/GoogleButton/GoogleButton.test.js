import { render } from '@redwoodjs/testing/web'

import GoogleButton from './GoogleButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('GoogleButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GoogleButton />)
    }).not.toThrow()
  })
})
