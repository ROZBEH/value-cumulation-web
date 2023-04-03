import { render } from '@redwoodjs/testing/web'

import StartUpFundamentals from './StartUpFundamentals'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StartUpFundamentals', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StartUpFundamentals />)
    }).not.toThrow()
  })
})
