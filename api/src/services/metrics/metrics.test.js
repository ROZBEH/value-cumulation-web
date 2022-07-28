import {
  metrics,
  metric,
  createMetric,
  updateMetric,
  deleteMetric,
} from './metrics'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('metrics', () => {
  scenario('returns all metrics', async (scenario) => {
    const result = await metrics()

    expect(result.length).toEqual(Object.keys(scenario.metric).length)
  })

  scenario('returns a single metric', async (scenario) => {
    const result = await metric({ id: scenario.metric.one.id })

    expect(result).toEqual(scenario.metric.one)
  })

  scenario('creates a metric', async () => {
    const result = await createMetric({
      input: { name: 'String4673622' },
    })

    expect(result.name).toEqual('String4673622')
  })

  scenario('updates a metric', async (scenario) => {
    const original = await metric({ id: scenario.metric.one.id })
    const result = await updateMetric({
      id: original.id,
      input: { name: 'String17473632' },
    })

    expect(result.name).toEqual('String17473632')
  })

  scenario('deletes a metric', async (scenario) => {
    const original = await deleteMetric({ id: scenario.metric.one.id })
    const result = await metric({ id: original.id })

    expect(result).toEqual(null)
  })
})
