import { atom } from 'recoil'

export const reportNameArrays = atom({
  key: 'reportNameArrays',
  default: [],
})
export const allReportArrays = atom({
  key: 'allReportArrays',
  default: [],
})
export const pickedReportArrays = atom({
  key: 'pickedReportArrays',
  default: [],
})
export const reportLink = atom({
  key: 'reportLink',
  default: '',
})

// Keep track of the company value after moving between tabs
export const valueCompany = atom({
  key: 'valueCompany',
  default: '',
})

export const inputValueCompany = atom({
  key: 'inputValueCompany',
  default: '',
})

// Keep track of the report value after moving between tabs
export const valueReport = atom({
  key: 'valueReport',
  default: '',
})

export const inputValueReport = atom({
  key: 'inputValueReport',
  default: '',
})

// Keep track of the date value after moving between tabs
export const valueDate = atom({
  key: 'valueDate',
  default: '',
})

export const inputValueDate = atom({
  key: 'inputValueDate',
  default: '',
})
