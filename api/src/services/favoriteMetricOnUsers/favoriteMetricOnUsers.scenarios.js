export const standard = defineScenario({
  favoriteMetricOnUser: {
    one: {
      data: {
        favoriteMetric: { create: { name: 'String5608672' } },
        user: { create: { email: 'String2999140' } },
      },
    },

    two: {
      data: {
        favoriteMetric: { create: { name: 'String5193139' } },
        user: { create: { email: 'String629912' } },
      },
    },
  },
})
