/**
 * *************************************************
 * THIS SCRIPT IS NOT USED IN THE APP AT THE MOMENT*
 * *************************************************
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import styled, { keyframes } from 'styled-components'

import SpinnerSVG from './spinner.svg'

const turn = keyframes`
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
`

const Spinner = styled(SpinnerSVG)`
  animation: ${turn} 1000ms linear infinite;
`

export default Spinner
