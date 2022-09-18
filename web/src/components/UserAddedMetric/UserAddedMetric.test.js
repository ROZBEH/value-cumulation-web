/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

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
