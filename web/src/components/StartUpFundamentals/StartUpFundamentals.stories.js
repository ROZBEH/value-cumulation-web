// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <StartUpFundamentals {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import StartUpFundamentals from './StartUpFundamentals'

export const generated = () => {
  return <StartUpFundamentals />
}

export default {
  title: 'Components/StartUpFundamentals',
  component: StartUpFundamentals,
}
