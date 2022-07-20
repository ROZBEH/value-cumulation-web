import { render } from '@redwoodjs/testing/web'

import Content from './Content'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Content', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Content />)
    }).not.toThrow()
  })
})
