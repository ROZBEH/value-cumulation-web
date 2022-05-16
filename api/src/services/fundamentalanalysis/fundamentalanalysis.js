import { Checklist } from './Checklist'

export const getFundamental = async ({ ticker }) => {
  const checklist = new Checklist(ticker)
  await checklist.initialize()
  const revDelta = await checklist.revenueDelta()[1]
  return {
    ticker: ticker,
    intrinsic_value: revDelta,
  }
}
