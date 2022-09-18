/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const standard = defineScenario({
  favoriteMetricOnUser: {
    one: {
      data: {
        favoriteMetric: { create: { name: 'String1741520' } },
        user: { create: { email: 'String6982588' } },
      },
    },

    two: {
      data: {
        favoriteMetric: { create: { name: 'String4603391' } },
        user: { create: { email: 'String2131414' } },
      },
    },
  },
})
