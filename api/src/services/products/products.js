/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { stripe } from 'src/lib/stripe'

export const products = async ({ type = 'one_time' }) => {
  // Get a list of active products
  const products = await stripe.products.list({
    active: true,
  })

  const itemList = []
  for (const product of products.data) {
    // Get a list of prices relating to product
    const prices = await stripe.prices.list({
      type: type,
      product: product.id,
    })

    // if env is prod get the live price otherwise test
    let price
    if (process.env.NODE_ENV === 'production') {
      price = prices.data.filter((price) => price.livemode === true)[0]
    } else {
      price = prices.data.filter((price) => price.livemode === false)[0]
    }

    // ignore prices with the "wrong" type
    if (typeof price !== 'undefined') {
      itemList.push({
        id: price.id,
        name: product.name,
        description: product.description,
        image: product.images[0],
        price: price.unit_amount,
        type: price.type,
      })
    }
  }

  return itemList
}
