import {
  favoriteMetricOnUsers,
  favoriteMetricOnUser,
  createFavoriteMetricOnUser,
  updateFavoriteMetricOnUser,
  deleteFavoriteMetricOnUser,
} from './favoriteMetricOnUsers'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('favoriteMetricOnUsers', () => {
  scenario('returns all favoriteMetricOnUsers', async (scenario) => {
    const result = await favoriteMetricOnUsers()

    expect(result.length).toEqual(
      Object.keys(scenario.favoriteMetricOnUser).length
    )
  })

  scenario('returns a single favoriteMetricOnUser', async (scenario) => {
    const result = await favoriteMetricOnUser({
      id: scenario.favoriteMetricOnUser.one.id,
    })

    expect(result).toEqual(scenario.favoriteMetricOnUser.one)
  })

  scenario('creates a favoriteMetricOnUser', async (scenario) => {
    const result = await createFavoriteMetricOnUser({
      input: {
        favoriteMetricId: scenario.favoriteMetricOnUser.two.favoriteMetricId,
        userId: scenario.favoriteMetricOnUser.two.userId,
      },
    })

    expect(result.favoriteMetricId).toEqual(
      scenario.favoriteMetricOnUser.two.favoriteMetricId
    )

    expect(result.userId).toEqual(scenario.favoriteMetricOnUser.two.userId)
  })

  scenario('updates a favoriteMetricOnUser', async (scenario) => {
    const original = await favoriteMetricOnUser({
      id: scenario.favoriteMetricOnUser.one.id,
    })

    const result = await updateFavoriteMetricOnUser({
      id: original.id,
      input: {
        favoriteMetricId: scenario.favoriteMetricOnUser.two.favoriteMetricId,
      },
    })

    expect(result.favoriteMetricId).toEqual(
      scenario.favoriteMetricOnUser.two.favoriteMetricId
    )
  })

  scenario('deletes a favoriteMetricOnUser', async (scenario) => {
    const original = await deleteFavoriteMetricOnUser({
      id: scenario.favoriteMetricOnUser.one.id,
    })

    const result = await favoriteMetricOnUser({ id: original.id })

    expect(result).toEqual(null)
  })
})
