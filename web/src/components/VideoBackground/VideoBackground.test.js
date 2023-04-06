import { render } from '@redwoodjs/testing/web'

import VideoBackground from './VideoBackground'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('VideoBackground', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<VideoBackground />)
    }).not.toThrow()
  })
})
