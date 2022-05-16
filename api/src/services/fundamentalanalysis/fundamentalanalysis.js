import { Checklist } from './Checklist'

export const getFundamental = async ({ ticker }) => {
  const checklist = new Checklist(ticker)
  await checklist.initialize()

  return {
    ticker,
    intrinsic_value: checklist.rAndDBudgetToRevenue()[0],
  }
}
