/**
 * Types
 *
 * @typedef {{
 *  currency: string,
 *  unit_amount: number,
 *  recurring?: {
 *    interval: 'month',
 *  }
 * }} Price
 *
 * @typedef {{
 *  name: string
 *  description: string
 *  prices: Price[]
 * }} Superpower
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { prompt } from 'enquirer'

import { stripe } from 'src/lib/stripe'

export default async () => {
  const { data: products } = await stripe.products.list({
    active: true,
  })

  const hasProducts = Boolean(products.length)

  if (hasProducts) {
    const { shouldArchiveProducts } = await prompt({
      name: 'shouldArchiveProducts',
      type: 'confirm',
      message:
        'It looks like you already have products and prices. Do you want to archive and re-seed them?',
    })

    if (!shouldArchiveProducts) {
      console.log('Exiting')
      process.exit(1)
    }

    for (const product of products) {
      await stripe.products.update(product.id, { active: false })
    }
  }

  /** @type {Superpower[]} */
  const superpowers = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'superpowers.json'), 'utf-8')
  )

  for (const superpower of superpowers) {
    const { prices, ...productData } = superpower

    const product = await stripe.products.create(productData)

    for (const price of prices) {
      await stripe.prices.create({
        product: product.id,
        ...price,
      })
    }
  }

  console.log(
    'Remember to add the images in the web/public/img directory to the products in the Stripe dashboard. https://dashboard.stripe.com/test/products'
  )

  const { shouldOpenDashboard } = await prompt({
    name: 'shouldOpenDashboard',
    type: 'confirm',
    message: 'Do you want to open the Stripe dashboard now?',
  })

  if (shouldOpenDashboard) {
    console.log('Opening dashboard')
    execSync('open https://dashboard.stripe.com/test/products?active=true')
  }
}
