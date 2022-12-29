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

import { FILTERED_COMPANIES } from 'src/commons/gql'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'
import {
  metricBox as metricBoxAtom,
  filteredCompanyRows as filteredCompanyRowsAtom,
  filteredCompanyCols as filteredCompanyColsAtom,
} from 'src/recoil/atoms'

export const Companyfinder = () => {
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
    metricBox.map((metric) => {
      if (metric.value) {
        inputMetrics.push({
          name: metric.value,
          value: parseFloat(metric.range),
        })
      }
    })
    event.preventDefault()

    getFilteredCompanyList({
      variables: { input: inputMetrics },
      loading: true,
    })
  }

  return (
    <div className="ml-1">
      <div className="mb-10">
        <p>
          To begin, input the metrics you wish to track in the first box, and
          specify the minimum value you would like our search engine to locate
          in the second box.
        </p>
      </div>
      <form name="companyfinder" onSubmit={onSubmit} className="">
        <div className="mb-7">
          {metricBox.map((metric, index) => {
            return (
              <div key={index} className="mb-7 flex">
                <Metricsearch
                  metricTitle={metric.title}
                  value={metric}
                  minRange={-1}
                  maxRange={1}
                  className=""
                  index={index}
                />

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
            )
          })}
        </div>

        <div className="">
          <div>
            <FormLabel>Add more metrics</FormLabel>
          </div>
          <button
            className="cursor-pointer ml-10"
            onClick={(event) => {
              event.preventDefault()
              return setMetricBox([
                ...metricBox,
                { value: '', title: '', range: 0 },
              ])
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
                <p>Fetching and displaying results</p>
                <p>Our Search Engine is Running Behind the Scenes.</p>
                <p>This May take few minutes</p>
              </div>
            </div>
          </div>
        )}
      </form>
      {filteredCompanyRows.length !== 0 && (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredCompanyRows}
            columns={filteredCompanyCols}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      )}
    </div>
  )
}
