// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <GoogleButton {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import GoogleButton from './GoogleButton'

export const generated = () => {
  return <GoogleButton />
}

export default {
  title: 'Components/GoogleButton',
  component: GoogleButton,
}
