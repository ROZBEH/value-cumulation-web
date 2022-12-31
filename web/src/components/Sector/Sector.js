/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useRecoilValue } from 'recoil'

import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'

export const Sector = () => {
  const sectorCompanies = useRecoilValue(sectorCompaniesAtom)

  return (
    <div>
      {sectorCompanies.length > 0 ? (
        sectorCompanies.map((company, index) => (
          <div key={index}>
            {company.symbol}: {company.name}
          </div>
        ))
      ) : (
        <div>Please first pick a company on the FINANCIALS tab</div>
      )}
    </div>
  )
}
