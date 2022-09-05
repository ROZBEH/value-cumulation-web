import { useRecoilValue } from 'recoil'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'

export const Sector = () => {
  const sectorCompanies = useRecoilValue(sectorCompaniesAtom)

  return (
    <div>
      {sectorCompanies.map((company, index) => (
        <div key={index}>{company}</div>
      ))}
    </div>
  )
}
