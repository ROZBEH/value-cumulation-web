import { render } from '@redwoodjs/testing/web'

import UserAddedMetric from './UserAddedMetric'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserAddedMetric', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserAddedMetric />)
    }).not.toThrow()
  })
})
