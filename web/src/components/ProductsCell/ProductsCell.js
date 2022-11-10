/**
 * *************************************************
 * THIS SCRIPT IS NOT USED IN THE APP AT THE MOMENT*
 * *************************************************
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'

import List from 'src/components/List'
import Product from 'src/components/Product'
import Spinner from 'src/components/Spinner'

export const QUERY = gql`
  query Products($type: ProductType) {
    products(type: $type) {
      id
      name
      description
      image
      price
      type
    }
  }
`

export const Loading = () => (
  <Wrapper>
    <Background>
      <Spinner />
    </Background>
  </Wrapper>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => {
  console.error(error.stack)

  return (
    <Wrapper>
      <Background>
        <AlertTriangle />
      </Background>
    </Wrapper>
  )
}

export const Success = ({ products }) => {
  return (
    <div>
      <List items={products} Component={Product} />
    </div>
  )
}

// Styles

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  gap: var(--padding);

  height: var(--size-13);
`

const Background = styled.div`
  width: 100%;
  height: 100%;

  background-color: var(--gray-1);
  border-radius: var(--radius-2);

  display: grid;
  place-content: center;
`
