import { db } from 'api/src/lib/db'

export default async () => {
  try {
    // If you run the following command from terminal, it will trigger the seed script.
    // This is a good way of testing your database and see whether your logic works as expected.
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
      { id: 1 },
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
        // Delete all the relationships for a specific user
        // const result = await db.user.update({
        //   data: {
        //     favoriteMetrics: {
        //       deleteMany: {},
        //     },
        //   },
        //   where: {
        //     id: data.id,
        //   },
        // })
        // Query the metric, if it doesn't exist then create.
        // Unfortunately the update part is necessary.
        // const result = await db.favoriteMetric.upsert({
        //   where: { name: 'test3' },
        //   create: {
        //     name: 'test3',
        //   },
        //   update: {
        //     name: 'test3',
        //   },
        // })
        // const record = await db.user.upsert({
        //   where: { email: data.email },
        //   create: {
        //     email: data.email,
        //     favoriteMetrics: {
        //       connectOrCreate: data.favoriteMetrics,
        //     },
        //   },
        //   update: {
        //     favoriteMetrics: { connectOrCreate: data.favoriteMetrics },
        //   },
        // })
        // Associate the speciific metric with the user. Create the metric if it doesn't exist.
        // const record = await db.favoriteMetric.upsert({
        //   where: { name: 'test1' },
        //   create: {
        //     name: 'test1',
        //     users: {
        //       connectOrCreate: [
        //         {
        //           create: { userId: 1 },
        //           where: { id: 2 },
        //         },
        //       ],
        //     },
        //   },
        //   update: {
        //     users: {
        //       connectOrCreate: [
        //         {
        //           create: { userId: 1 },
        //           where: { id: 2 },
        //         },
        //       ],
        //     },
        //   },
        // })
        // Find the list of favorite metrics for a specific user.
        // const rouzbehInfo = await db.user.findUnique({
        //   where: { id: 1 },
        //   include: { favoriteMetrics: { include: { favoriteMetric: true } } },
        // })
        // const result = {
        //   id: rouzbehInfo.id,
        //   email: rouzbehInfo.email,
        //   favoriteMetrics: rouzbehInfo.favoriteMetrics.map(
        //     (item) => item.favoriteMetric
        //   ),
        // }
        // console.log('resultFavMetric = ', result)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
