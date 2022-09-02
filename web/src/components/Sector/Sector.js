import { useLazyQuery } from '@apollo/react-hooks'
import { useEffect, useState } from 'react'
import { GPT_QUERY } from 'src/commons/gql'
export const Sector = () => {
  const [sectorCompanies, setSectorCompanies] = useState([])
  const [getGPTResponse] = useLazyQuery(GPT_QUERY, {
    onCompleted: (data) => {
      setSectorCompanies(data.gptIntelligence.response)
    },
  })
  useEffect(() => {
    getGPTResponse({
      variables: { query: 'hello' },
    })
  }, [getGPTResponse])
  return (
    <div>
      {sectorCompanies.map((company, index) => (
        <div key={index}>{company}</div>
      ))}
    </div>
  )
}
