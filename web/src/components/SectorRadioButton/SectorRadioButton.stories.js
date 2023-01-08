// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <SectorRadioButton {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import SectorRadioButton from './SectorRadioButton'

export const generated = () => {
  return <SectorRadioButton />
}

export default {
  title: 'Components/SectorRadioButton',
  component: SectorRadioButton,
}
