/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { fetch } from 'cross-undici-fetch'

import { companyslist } from 'src/services/searchbar/searchbar'

export const getFilteredCompanies = async ({ inputMetrics }) => {
  console.log('I am inside userformula service')
  console.log('inputMetrics = ', inputMetrics)
  const companyList = await companyslist()
  console.log('companyList = ', companyList[0])

  return { names: ['Test 1', 'Test 2'] }
}
