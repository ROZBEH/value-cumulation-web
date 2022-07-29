import { db } from 'src/lib/db'

export const users = () => {
  console.log('------------------------------------------')
  console.log('I was here once upon a time')
  return db.user.findMany({
    // Include the user's favorite metrics in the response
    include: { favoriteMetrics: true },
  })
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
    // Include the user's favorite metrics in the response
    include: { favoriteMetrics: true },
  })
}

export const createUser = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const createMetric = ({ input }) => {
  return db.metric.create({
    data: input,
  })
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

// export const User = {
//   favoriteMetrics: (_obj, { root }) =>
//     db.user.findUnique({ where: { id: root.id } }).favoriteMetrics(),
// }
