/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { sendEmail } from 'src/lib/mailer'

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
  const message = {
    to: 'rouzbeh.asghari@gmail.com',
    subject: 'Contact Us form submission',
    html: `
    <p>Name: ${input.name}</p>
    <p>Email: ${input.email}</p>
    <p>Message: ${input.message}</p>`,
  }

  sendEmail(message)
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
