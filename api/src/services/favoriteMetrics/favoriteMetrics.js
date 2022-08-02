import { db } from 'src/lib/db'

export const favoriteMetrics = () => {
  return db.favoriteMetric.findMany()
}

export const favoriteMetric = ({ id }) => {
  return db.favoriteMetric.findUnique({
    where: { id },
  })
}

export const createFavoriteMetric = ({ input }) => {
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
