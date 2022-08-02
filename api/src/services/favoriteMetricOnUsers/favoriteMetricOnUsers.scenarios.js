export const standard = defineScenario({
  favoriteMetricOnUser: {
    one: {
      data: {
        favoriteMetric: { create: { name: 'String' } },
        user: { create: { email: 'String240368' } },
      },
    },

    two: {
      data: {
        favoriteMetric: { create: { name: 'String' } },
        user: { create: { email: 'String9064092' } },
      },
    },
  },
})
