/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { useLazyQuery } from '@apollo/client'
import FormLabel from '@mui/material/FormLabel'
import { useRecoilState } from 'recoil'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { FILTERED_COMPANIES } from 'src/commons/gql'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'
import { filteredCompanyList as filteredCompanyListAtom } from 'src/recoil/atoms'

export const Userformula = () => {
  const [filteredCompanyList, setFilteredCompanyList] = useRecoilState(
    filteredCompanyListAtom
  )
  console.log('filteredCompanyList = ', filteredCompanyList)
  const [getFilteredCompanyList] = useLazyQuery(FILTERED_COMPANIES, {
    onCompleted: (data) => {
      console.log(data)
      setFilteredCompanyList(data.getFilteredCompanies)
    },
  })

  const onSubmit = (event) => {
    var inputMetrics = []
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].tagName === 'INPUT') {
        let currentMetric = AVAILABLE_METRICS.find(
          (item) => item.title === event.target[i].value
        )
        if (currentMetric) {
          inputMetrics.push({
            name: currentMetric.value,
          })
        } else {
          inputMetrics[inputMetrics.length - 1].value = parseFloat(
            event.target[i].value
          )
        }
        event.preventDefault()
      }
    }
    getFilteredCompanyList({
      variables: { input: inputMetrics },
    })
  }

  return (
    <div className="ml-1">
      <form
        name="userformula"
        onSubmit={onSubmit}
        className="flex flex-col w-3/12"
      >
        <Metricsearch name="test" />
        <Metricsearch name="test2" />
        <FormLabel className="mt-5"> Submit the request</FormLabel>
        <button
          type="submit"
          className="rounded-lg w-20 h-8 bg-lightsky-blue border border-gray-300 text-white cursor-pointer ml-1 mt-4"
          name="submit"
        >
          {' '}
          Submit
        </button>
        {filteredCompanyList.length !== 0 && (
          <div className="mt-5">
            <FormLabel>Results</FormLabel>
            <div className="flex flex-col">
              {filteredCompanyList.map((company, key) => (
                <div key={key} className="flex flex-row">
                  <div className="w-1/2">{company.name}</div>
                  <div className="w-1/2">{company.values}</div>
                  <div className="w-1/2">{company.metrics}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
