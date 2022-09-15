/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'

export const contacts = () => {
  return db.contact.findMany()
}

export const contact = ({ id }) => {
  return db.contact.findUnique({
    where: { id },
  })
}

export const createContact = ({ input }) => {
  validate(input.email, 'email', { email: true })
  return db.contact.create({
    data: input,
  })
}

// export const updateContact = ({ id, input }) => {
//   return db.contact.update({
//     data: input,
//     where: { id },
//   })
// }

// export const deleteContact = ({ id }) => {
//   return db.contact.delete({
//     where: { id },
//   })
// }
