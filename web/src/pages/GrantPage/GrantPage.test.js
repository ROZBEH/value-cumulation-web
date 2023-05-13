import { render } from '@redwoodjs/testing/web'

import GrantPage from './GrantPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('GrantPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GrantPage />)
    }).not.toThrow()
  })
})
