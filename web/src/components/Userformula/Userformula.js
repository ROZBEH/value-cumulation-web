import FormLabel from '@mui/material/FormLabel'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { Metricsearch } from 'src/components/Metricsearch/Metricsearch'

export const Userformula = () => {
  const onSubmit = (event) => {
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].tagName === 'INPUT') {
        let currentMetric = AVAILABLE_METRICS.find(
          (item) => item.title === event.target[i].value
        )
        if (currentMetric) {
          console.log(currentMetric.value)
        } else {
          console.log(event.target[i].value)
        }
        event.preventDefault()
      }
    }
  }

  return (
    <div className="ml-1">
      <form
        name="userformula"
        onSubmit={onSubmit}
        className="flex flex-col w-3/12"
      >
        <Metricsearch name="test" />
        <FormLabel className="mt-5"></FormLabel>
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
