import { MetaTags } from '@redwoodjs/web'
import { Content } from 'src/components/Content/Content'
const AboutPage = () => {
  return (
    <>
      <MetaTags title="About" description="About page" />

      <div className="mx-96">
        <Content />
      </div>
    </>
  )
}

export default AboutPage
