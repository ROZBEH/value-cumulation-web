/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { db } from 'src/lib/db'

export const users = () => {
  return db.user.findMany()
}

export const user = async ({ id }) => {
  // Find the user info based on the unique ID and then return the user info.
  // Some post processing need to happen since the favorite metrics are not
  // directly associated with the user. Rather it's a many-to-many relationship.
  const userInfo = await db.user.findUnique({
    where: { id },
    include: { favoriteMetrics: { include: { favoriteMetric: true } } },
  })

  const result = {
    id: userInfo.id,
    email: userInfo.email,
    favorites: userInfo.favoriteMetrics.map((item) => item.favoriteMetric),
  }

  return result
}

export const createUser = ({ input }) => {
  return db.user.create({
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

export const deleteAllFavoritesUser = ({ id }) => {
  return db.user.update({
    data: {
      favoriteMetrics: {
        deleteMany: {},
      },
    },
    where: {
      id: id,
    },
  })
}

export const User = {
  favoriteMetrics: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).favoriteMetrics(),
}

// Only to be used on the api side
export const getCustomerId = async ({ id }) => {
  return await db.user.findUnique({
    where: { id: id },
  })
}

export const getUserByCustomerId = ({ id }) => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  })
}

export const updateUserByCustomerId = ({ id, payload }) => {
  return db.user.update({
    where: {
      id,
    },
    data: payload,
  })
}

// update db if name and email has changed
export const handleDBSync = async (id, nextName, nextEmail) => {
  const customer = await getUserByCustomerId({ id })

  if (nextEmail === customer.email && nextName === customer.name) {
    return
  }

  const payload = {}

  if (nextEmail !== customer.email) {
    payload.email = nextEmail
  }

  if (nextName !== customer.name) {
    payload.name = nextName
  }

  return await updateUserByCustomerId({ id, payload })
}
