import { atom, atomFamily, selectorFamily, DefaultValue } from 'recoil'

export const metrics = atom({
  key: 'metrics',
  default: ['netIncome', 'freeCashFlow'],
})

export const ticker = atom({
  key: 'ticker',
  default: [],
})

export const counterCompany = atom({
  key: 'counterCompany',
  default: 1,
})

export const name = atom({
  key: 'name',
  default: '',
})

export const textPrompt = atom({
  key: 'textPrompt',
  default: '',
})

export const suggestions = atom({
  key: 'suggestions',
  default: [],
})

export const loadingFinancials = atom({
  key: 'loadingFinancials',
  default: false,
})

export const plottingData = atom({
  key: 'plottingData',
  default: {},
})
