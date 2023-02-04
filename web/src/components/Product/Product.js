/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { useLazyQuery } from '@apollo/client'
// import styled from 'styled-components'
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { Tooltip } from '@material-ui/core'
import { Subscriptions } from '@material-ui/icons'

import { PRODUCTS_QUERY } from 'src/commons/gql'
// import Button from 'src/components/Button'
import {
  useAddToCart,
  useCheckout,
  useClearCart,
} from 'src/components/CartProvider'

const Product = () => {
  const [getProducts, { _called, _loading, _data }] =
    useLazyQuery(PRODUCTS_QUERY)

  const addToCart = useAddToCart()
  const checkout = useCheckout()
  const clearCart = useClearCart()
  const onCheckout = () => {
    // clear the cart if there are still stuff from previous session

    clearCart()
    getProducts({
      variables: { type: 'recurring' },
    }).then((res) => {
      addToCart(res.data.products[0])
      checkout()
    })
  }

  return (
    <div>
      {/* <Button className="mx-1" onClick={onCheckout}>
        <Subscriptions />
        Manage Subscription
      </Button> */}
      <Tooltip title="Manage Subscription">
        <Subscriptions
          className="cursor-pointer"
          onClick={onCheckout}
          fontSize="medium"
        />
      </Tooltip>
    </div>
    // <Wrapper
    //   onClick={() => onCheckout({ id, name, description, price, image, type })}
    // >
    //   <div style={{ overflow: 'hidden' }}>
    //     <Image alt={description} src={image} />
    //   </div>
    //   <ProductInfo>
    //     <Name>{name}</Name>
    //     <Price>
    //       {(price / 100).toLocaleString('en-US', {
    //         style: 'currency',
    //         currency: 'USD',
    //       })}
    //     </Price>
    //   </ProductInfo>
    // </Wrapper>
  )
}

export default Product

// Styles

// const Image = styled.img`
//   height: var(--size-13);
//   object-fit: contain;

//   border-radius: var(--radius-2);
//   background-color: var(--gray-1);

//   transition: transform 500ms;
// `

// const Wrapper = styled.figure`
//   &:hover {
//     cursor: pointer;
//   }

//   &:hover ${Image} {
//     transform: scale(1.125);
//     transition: transform 200ms;
//   }
// `

// const ProductInfo = styled.figcaption`
//   margin-top: var(--size-2);
// `

// const Name = styled.p`
//   font-size: var(--font-size-3);
//   font-weight: var(--font-weight-6);
// `

// const Price = styled.span`
//   color: var(--gray-6);
// `
