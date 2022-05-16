import spawn from 'await-spawn'
import { Checklist } from './Checklist'

export const getFundamental = async ({ ticker }) => {
  // const pythonReturned = await spawn(
  //   '/Users/rouzbeh/opt/miniconda3/envs/vc/bin/python',
  //   [
  //     '/Users/rouzbeh/redwood/value-cumulation/api/src/services/fundamentalanalysis/checklist.py',
  //     ticker.toUpperCase(),
  //   ]
  // )
  // const out_ = await JSON.parse(pythonReturned)
  const checklist = new Checklist(ticker)
  await checklist.initialize()

  return {
    ticker,
    intrinsic_value: checklist.rAndDBudgetToRevenue()[0],
  }
}
