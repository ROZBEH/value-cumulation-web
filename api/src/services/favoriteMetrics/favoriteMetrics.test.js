import {
  favoriteMetrics,
  favoriteMetric,
  createFavoriteMetric,
  updateFavoriteMetric,
  deleteFavoriteMetric,
} from './favoriteMetrics'
import { users, user, createUser, updateUser, deleteUser } from '../users/users'
// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('favoriteMetrics', () => {
  scenario('returns all favoriteMetrics', async (scenario) => {
    const result = await favoriteMetrics()

    expect(result.length).toEqual(Object.keys(scenario.favoriteMetric).length)
  })

  scenario('returns a single favoriteMetric', async (scenario) => {
    const result = await favoriteMetric({
      id: scenario.favoriteMetric.one.id,
    })

    expect(result).toEqual(scenario.favoriteMetric.one)
  })

  scenario('creates a favoriteMetric', async () => {
    const result = await createFavoriteMetric({
      input: { name: 'String5457219' },
    })

    expect(result.name).toEqual('String5457219')
  })

  scenario('updates a favoriteMetric', async (scenario) => {
    const original = await favoriteMetric({
      id: scenario.favoriteMetric.one.id,
    })
    const resultUser = await createUser({
      input: { email: 'String4674023' },
    })
    console.log('resultUser > ', resultUser)
    const result = await updateFavoriteMetric({
      id: original.id,
      input: { name: 'String28936102', users: { connect: { id: 1 } } },
    })
    console.log('result > ', result)

    expect(result.name).toEqual('String28936102')
  })

  // scenario('deletes a favoriteMetric', async (scenario) => {
  //   const original = await deleteFavoriteMetric({
  //     id: scenario.favoriteMetric.one.id,
  //   })

  //   const result = await favoriteMetric({ id: original.id })

  //   expect(result).toEqual(null)
  // })
})
