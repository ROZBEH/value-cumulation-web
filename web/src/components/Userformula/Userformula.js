/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { useLazyQuery } from '@apollo/client'
import FormLabel from '@mui/material/FormLabel'
import { DataGrid } from '@mui/x-data-grid'
import { useRecoilState } from 'recoil'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { FILTERED_COMPANIES } from 'src/commons/gql'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'
import {
  filteredCompanyRows as filteredCompanyRowsAtom,
  filteredCompanyCols as filteredCompanyColsAtom,
} from 'src/recoil/atoms'

export const Userformula = () => {
  const [filteredCompanyRows, setFilteredCompanyRows] = useRecoilState(
    filteredCompanyRowsAtom
  )
  const [filteredCompanyCols, setFilteredCompanyCols] = useRecoilState(
    filteredCompanyColsAtom
  )
  const [getFilteredCompanyList] = useLazyQuery(FILTERED_COMPANIES, {
    onCompleted: (data) => {
      console.log('data = ', data)
      const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'company', headerName: 'Company', width: 250 },
      ]
      columns.push(
        ...data.getFilteredCompanies[0].metrics.map((metric) => ({
          field: metric,
          headerName: metric,
          width: 200,
        }))
      )
      setFilteredCompanyCols(columns)
      const metricsValue = data.getFilteredCompanies.map((company) => {
        const obj = {}
        company.metrics.map((metric, idx) => {
          obj[metric] = company.values[idx]
        })
        return obj
      })
      const rows = data.getFilteredCompanies.map((company, idx) => ({
        id: idx,
        company: company.name,
        ...metricsValue[idx],
      }))
      console.log('rows = ', rows)
      setFilteredCompanyRows(rows)
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
        {filteredCompanyRows.length !== 0 && (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredCompanyRows}
              columns={filteredCompanyCols}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        )}
      </form>
    </div>
  )
}
