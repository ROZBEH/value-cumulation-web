// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <Verification {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import Verification from './Verification'

export const generated = () => {
  return <Verification />
}

export default {
  title: 'Components/Verification',
  component: Verification,
}
