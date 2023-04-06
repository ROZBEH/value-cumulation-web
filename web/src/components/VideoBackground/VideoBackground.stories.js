// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```jsx
// export const generated = (args) => {
//   return <VideoBackground {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import VideoBackground from './VideoBackground'

export const generated = () => {
  return <VideoBackground />
}

export default {
  title: 'Components/VideoBackground',
  component: VideoBackground,
}
