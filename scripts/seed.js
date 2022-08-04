import { db } from 'api/src/lib/db'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    // Update "const data = []" to match your data model and seeding needs
    //
    const data = [
      // To try this example data with the UserExample model in schema.prisma,
      // uncomment the lines below and run 'yarn rw prisma migrate dev'
      //
      // { name: 'alice', email: 'alice@example.com' },
      // { name: 'mark', email: 'mark@example.com' },
      // { name: 'jackie', email: 'jackie@example.com' },
      {
        email: 'mrymfrh@gmail.com',
        favoriteMetrics: [
          { create: { favoriteMetricId: 1 }, where: { id: 2 } },
        ],
      },
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    Promise.all(
      //
      // Change to match your data model and seeding needs
      //
      data.map(async (data) => {
        const record = await db.user.upsert({
          where: { email: data.email },
          create: {
            email: data.email,
            favoriteMetrics: {
              connectOrCreate: data.favoriteMetrics,
            },
          },
          update: {
            favoriteMetrics: { connectOrCreate: data.favoriteMetrics },
          },
        })
        // const record = await db.userExample.create({ data })
        console.log('record = ', record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
