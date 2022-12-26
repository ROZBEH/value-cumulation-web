/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { useLazyQuery } from '@apollo/client'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import FormLabel from '@mui/material/FormLabel'
import { DataGrid } from '@mui/x-data-grid'
import { TailSpin } from 'react-loader-spinner'
import { useRecoilState } from 'recoil'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { FILTERED_COMPANIES } from 'src/commons/gql'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'
import {
  metricBox as metricBoxAtom,
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

  const [metricBox, setMetricBox] = useRecoilState(metricBoxAtom)
  const [getFilteredCompanyList, loading] = useLazyQuery(FILTERED_COMPANIES, {
    onCompleted: (data) => {
      const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
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
      setFilteredCompanyRows(rows)
    },
  })

  const removeMetricBox = (index) => {
    const newMetricBox = metricBox.filter((_, i) => i !== index)
    setMetricBox(newMetricBox)
  }

  const onSubmit = (event) => {
    setFilteredCompanyCols([])
    setFilteredCompanyRows([])
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
      loading: true,
    })
  }

  return (
    <div className="ml-1">
      <form name="userformula" onSubmit={onSubmit} className="">
        <div className="mb-7">
          {metricBox.map((_, index) => (
            <div key={index} className="mb-7 flex">
              <Metricsearch minRange={-1} maxRange={1} className="" />

              {index ? (
                <button
                  className=" ml-4"
                  type="button"
                  onClick={() => removeMetricBox(index)}
                >
                  <RemoveCircleOutlineIcon />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <div className="">
          <div>
            <FormLabel>Add more metrics</FormLabel>
          </div>
          <button
            className="cursor-pointer ml-10"
            onClick={(event) => {
              event.preventDefault()
              return setMetricBox([...metricBox, { name: '', email: '' }])
            }}
          >
            <AddCircleOutlineIcon />
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center">
          <div>
            <FormLabel> Submit your formula</FormLabel>
          </div>
          <button
            type="submit"
            className="rounded-lg w-20 h-8 bg-lightsky-blue border border-gray-300 text-white cursor-pointer ml-1"
            name="submit"
          >
            {' '}
            Submit
          </button>
        </div>
        {loading.loading && (
          <div className="loader">
            <div className="loader-content">
              <TailSpin
                color="#15518e"
                height="40"
                width="40"
                className="tail-spinner"
              />
              <div className="loader-message">
                Fetching and displaying results
              </div>
            </div>
          </div>
        )}
        {filteredCompanyRows.length !== 0 && (
          <div style={{ height: 600, width: '130%' }}>
            <DataGrid
              rows={filteredCompanyRows}
              columns={filteredCompanyCols}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </div>
        )}
      </form>
    </div>
  )
}
