import { TailSpin } from 'react-loader-spinner'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import { useRecoilValue } from 'recoil'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import {
  plottingData as plottingDataA,
  loadingFinancials as loadingFinancialsA,
  metrics as metricsA,
  ticker as tickerA,
  name as nameA,
} from 'src/recoil/atoms'

const HomePage = () => {
  const plottingData = useRecoilValue(plottingDataA)
  const name = useRecoilValue(nameA)
  const metrics = useRecoilValue(metricsA)
  const ticker = useRecoilValue(tickerA)
  const loadingFinancials = useRecoilValue(loadingFinancialsA)

  const styleSpin = {
    position: 'relative',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  return (
    <>
      <Mainsubmission />
      {!name && ticker.length != 0 && (
        <h2>Fetching Data for symbol {ticker} ...</h2>
      )}
      <UserAddedMetric />
      <Mapping />
      {name && <h2>{name}</h2>}
      {loadingFinancials && (
        <div style={styleSpin}>
          <TailSpin color="#87CEEB" height="50" width="50" />
        </div>
      )}
      {metrics &&
        Object.keys(plottingData).length != 0 &&
        metrics.map((item, index) => (
          <PlotFundamentals key={index} metric={item} />
        ))}
    </>
  )
}

export default HomePage
