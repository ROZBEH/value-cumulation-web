/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

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

export const deleteFavoriteMetricOnUser = async ({ input }) => {
  // First find the metric's id and then delete the relationship row
  // between favorite metric and the user.
  const favMetric = await db.favoriteMetric.findUnique({
    where: { name: input.name },
  })

  return db.favoriteMetricOnUser.delete({
    where: {
      userId_favoriteMetricId: {
        userId: input.userId,
        favoriteMetricId: favMetric.id,
      },
    },
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
