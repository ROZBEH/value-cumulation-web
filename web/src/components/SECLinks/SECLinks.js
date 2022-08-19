import { useRecoilValue } from 'recoil'
import { secReports as secReportsAtom } from 'src/recoil/atoms'
export const SECLinks = () => {
  const secReport = useRecoilValue(secReportsAtom)
  return (
    <div>
      <h2>{JSON.stringify(secReport)}</h2>
    </div>
  )
}
