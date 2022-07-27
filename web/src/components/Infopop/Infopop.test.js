import { render } from '@redwoodjs/testing/web'

import Infopop from './Infopop'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Infopop', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Infopop />)
    }).not.toThrow()
  })
})
