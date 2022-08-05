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
  // Associate the speciific metric with the user. Create the metric if it doesn't exist.
  const connetCreateMetric = db.favoriteMetric.upsert({
    where: { name: input.name },
    create: {
      name: input.name,
      users: {
        connectOrCreate: [
          {
            create: { userId: input.userId },
            // The following id is required. It can be an arbitray value.
            // Not sure what it supposed to do.
            where: { id: 2 },
          },
        ],
      },
    },
    update: {
      users: {
        connectOrCreate: [
          {
            create: { userId: input.userId },
            // The following id is required. It can be an arbitray value.
            // Not sure what it supposed to do.
            where: { id: 2 },
          },
        ],
      },
    },
  })

  return connetCreateMetric
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
