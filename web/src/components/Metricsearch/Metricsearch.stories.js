// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <Metricsearch {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import Metricsearch from './Metricsearch'

export const generated = () => {
  return <Metricsearch />
}

export default {
  title: 'Components/Metricsearch',
  component: Metricsearch,
}
