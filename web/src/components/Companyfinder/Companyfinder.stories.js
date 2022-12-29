// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <Companyfinder {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import Companyfinder from './Companyfinder'

export const generated = () => {
  return <Companyfinder />
}

export default {
  title: 'Components/Companyfinder',
  component: Companyfinder,
}
