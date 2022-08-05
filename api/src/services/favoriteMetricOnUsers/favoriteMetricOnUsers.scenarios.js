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
