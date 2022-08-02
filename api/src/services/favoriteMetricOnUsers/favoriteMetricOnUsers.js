import { db } from 'src/lib/db'

export const favoriteMetricOnUsers = () => {
  return db.favoriteMetricOnUser.findMany()
}

export const favoriteMetricOnUser = ({ id }) => {
  return db.favoriteMetricOnUser.findUnique({
    where: { id },
  })
}

export const createFavoriteMetricOnUser = ({ input }) => {
  return db.favoriteMetricOnUser.create({
    data: input,
  })
}

export const updateFavoriteMetricOnUser = ({ id, input }) => {
  return db.favoriteMetricOnUser.update({
    data: input,
    where: { id },
  })
}

export const deleteFavoriteMetricOnUser = ({ id }) => {
  return db.favoriteMetricOnUser.delete({
    where: { id },
  })
}

export const FavoriteMetricOnUser = {
  favoriteMetric: (_obj, { root }) =>
    db.favoriteMetricOnUser
      .findUnique({ where: { id: root.id } })
      .favoriteMetric(),
  user: (_obj, { root }) =>
    db.favoriteMetricOnUser.findUnique({ where: { id: root.id } }).user(),
}
