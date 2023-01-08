import { render } from '@redwoodjs/testing/web'

import SectorRadioButton from './SectorRadioButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SectorRadioButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SectorRadioButton />)
    }).not.toThrow()
  })
})
