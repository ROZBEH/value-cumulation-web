import { db } from 'src/lib/db'

export const subscriptions = () => {
  return db.subscription.findMany()
}

export const subscription = ({ id }) => {
  return db.subscription.findUnique({
    where: { id },
  })
}

export const createSubscription = async ({ input }) => {
  const { subscriptionName, price, interval, userId } = input
  const newSubscription = await db.subscription.create({
    data: {
      subscriptionName,
      price,
      interval, // replace with the appropriate enum value
      users: {
        connect: {
          id: userId, // replace with the ID of the user you want to assign the subscription to
        },
      },
    },
  })
  await db.user.update({
    where: { id: userId },
    data: {
      subscription: {
        connect: {
          id: newSubscription.id,
        },
      },
    },
  })
  return newSubscription
}

export const updateSubscription = ({ id, input }) => {
  return db.subscription.update({
    data: input,
    where: { id },
  })
}

export const deleteSubscription = ({ id }) => {
  return db.subscription.delete({
    where: { id },
  })
}

export const Subscription = {
  users: (_obj, { root }) => {
    return db.subscription.findUnique({ where: { id: root?.id } }).users()
  },
}
