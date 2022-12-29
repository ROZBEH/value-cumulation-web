// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <Userformula {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import Userformula from './Userformula'

export const generated = () => {
  return <Userformula />
}

export default {
  title: 'Components/Userformula',
  component: Userformula,
}
