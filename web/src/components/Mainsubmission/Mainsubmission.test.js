/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

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
