import { db } from 'src/lib/db'

export const favoriteMetrics = () => {
  return db.favoriteMetric.findMany()
}

export const favoriteMetric = ({ id }) => {
  return db.favoriteMetric.findUnique({
    where: { id },
  })
}

export const favoriteMetricExists = ({ name }) => {
  return db.favoriteMetric.findUnique({
    where: { name },
  })
}

export const createFavoriteMetric = ({ input }) => {
  // favoriteMetricExists({ name: input.name })
  // if (favoriteMetricExists({ name: input.name })) {
  //   console.log('Favorite metric already exists')
  //   return {}
  // }
  return db.favoriteMetric.create({
    data: input,
  })
}

export const updateFavoriteMetric = ({ id, input }) => {
  return db.favoriteMetric.update({
    data: input,
    where: { id },
  })
}

export const deleteFavoriteMetric = ({ id }) => {
  return db.favoriteMetric.delete({
    where: { id },
  })
}

export const FavoriteMetric = {
  users: (_obj, { root }) =>
    db.favoriteMetric.findUnique({ where: { id: root.id } }).users(),
}
