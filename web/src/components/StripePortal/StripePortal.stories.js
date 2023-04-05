// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <StripePortal {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import StripePortal from './StripePortal'

export const generated = () => {
  return <StripePortal />
}

export default {
  title: 'Components/StripePortal',
  component: StripePortal,
}
