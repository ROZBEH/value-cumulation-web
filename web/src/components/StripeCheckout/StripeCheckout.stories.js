// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <StripeCheckout {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import StripeCheckout from './StripeCheckout'

export const generated = () => {
  return <StripeCheckout />
}

export default {
  title: 'Components/StripeCheckout',
  component: StripeCheckout,
}
