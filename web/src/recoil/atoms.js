import { atom } from 'recoil'

export const metrics = atom({
  key: 'metrics',
  default: ['netIncome'],
})

export const ticker = atom({
  key: 'ticker',
  default: '',
})

export const name = atom({
  key: 'name',
  default: '',
})

export const loadingFinancials = atom({
  key: 'loadingFinancials',
  default: false,
})
