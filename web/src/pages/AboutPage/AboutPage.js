/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

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
