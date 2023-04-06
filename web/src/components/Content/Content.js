/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { VideoBackground } from 'src/components/VideoBackground/VideoBackground'
export const Content = () => {
  return (
    <div className="flex flex-col mx-10 my-10">
      <p className="my-2 text-3xl font-bold text-purple-500">
        Focus on metrics that matter to you
      </p>
      <div className="flex items-center my-4 bg-gray-100 rounded-lg p-4">
        <p className="text-lg text-gray-800">
          Compare the performance of companies of your interest
        </p>
      </div>
      <div className="flex items-center my-4 bg-gray-100 rounded-lg p-4">
        <p className="text-lg text-gray-800">
          A personalized experience. Customize your profile to metrics that you
          care about.
        </p>
      </div>
      <div className="flex items-center my-4 bg-gray-100 rounded-lg p-4">
        <p className="text-lg text-gray-800">
          No cluttering in your space. Personalize your space towards your
          needs.
        </p>
      </div>
      <div className="flex items-center my-4 bg-gray-100 rounded-lg p-4">
        <p className="text-lg text-gray-800">
          Fast and reliable. Each metric one click away.
        </p>
      </div>
      <div className="flex items-center my-4 bg-gray-100 rounded-lg p-4">
        <p className="text-lg text-gray-800">
          Intuitive and friendly interface.
        </p>
      </div>
      <VideoBackground />
    </div>
  )
}
