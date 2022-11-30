import { useLazyQuery } from '@apollo/client'
import FormLabel from '@mui/material/FormLabel'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { FILTERED_COMPANIES } from 'src/commons/gql'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'

export const Userformula = () => {
  const [filteredCompanyList] = useLazyQuery(FILTERED_COMPANIES, {
    onCompleted: (data) => {
      console.log('data: ', data)
    },
  })

  const onSubmit = (event) => {
    var input = []
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].tagName === 'INPUT') {
        let currentMetric = AVAILABLE_METRICS.find(
          (item) => item.title === event.target[i].value
        )
        if (currentMetric) {
          input.push({
            name: currentMetric.value,
          })
        } else {
          input[input.length - 1].value = parseFloat(event.target[i].value)
        }
        event.preventDefault()
      }
    }
    filteredCompanyList({
      variables: { input: input },
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
      </form>
    </div>
  )
}
