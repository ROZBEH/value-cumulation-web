/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { atom } from 'recoil'

export const metricBox = atom({
  key: 'metricBox',
  default: [
    { value: '', title: '', range: 0 },
    { value: '', title: '', range: 0 },
  ],
})

// Create an atom for the list of metrics to be added to the plot
export const metrics = atom({
  key: 'metrics',
  default: ['netIncome', 'freeCashFlow', 'grossProfitMargin', 'priceToEarning'],
})

// Saves the current text in the searchbar as user types
export const textPrompt = atom({
  key: 'textPrompt',
  default: '',
})

// List of companies to be suggested to the user based
// on the text they type in the searchbar
export const suggestions = atom({
  key: 'suggestions',
  default: [],
})

// Whether the current status of the searchbar is loading
// This will be used in order to display a loading spinner
export const loadingFinancials = atom({
  key: 'loadingFinancials',
  default: false,
})

// This is heart beat of the application. It contains the plotting data
// of the companies. It will have the following format
// {
//    'netIncome': { 'metricName':'Net Income',
//                'nameCompany': ['Apple Inc.', 'Tesla Inc.'],
//                'data': [{ 'name': '2020', 'Apple Inc.': '$1,000,000', 'Tesla Inc.': '$900,000' },
//                         { 'name': '2021', 'Apple Inc.': '$1,100,000', 'Tesla Inc.': '$1,200,000' }]
//              }
//    'freeCashflow': { 'metricName':'Free Cashflow',
//                'nameCompany': ['Apple Inc.', 'Tesla Inc.'],
//                'data': [{ 'name': '2020', 'Apple Inc.': '$11,000,000', 'Tesla Inc.': '$15,000,000' },
//                         { 'name': '2021', 'Apple Inc.': '$10,100,000', 'Tesla Inc.': '$11,200,000' }]
//              }
// }
export const plottingData = atom({
  key: 'plottingData',
  default: {},
})

// This will get the list of all available companies on NASDAQ and NYSE on startup
// The current format for each company is
// {
//    exchange: "NASDAQ Global Select"
//    exchangeShortName: "NASDAQ"
//    name: "Comcast Corporation"
//    price: "39.96"
//    symbol: "CMCSA"
//    type: "stock"
// }
export const companyList = atom({
  key: 'companyList',
  default: [],
})

// This will keep track of the list of companies that the user has picked
export const calledCompanies = atom({
  key: 'calledCompanies',
  default: [
    {
      exchange: 'NASDAQ Global Select',
      exchangeShortName: 'NASDAQ',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'stock',
    },
    {
      exchange: 'NASDAQ Global Select',
      exchangeShortName: 'NASDAQ',
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      type: 'stock',
    },
  ],
})

export const userFavMetrics = atom({
  key: 'userFavMetrics',
  default: [],
})

export const secReports = atom({
  key: 'secReports',
  default: {},
})

export const filteredCompanyRows = atom({
  key: 'filteredCompanyRows',
  default: [],
})

export const filteredCompanyCols = atom({
  key: 'filteredCompanyCols',
  default: [],
})

export const sectorCompData = atom({
  key: 'sectorCompData',
  default: {},
})

export const sectorComp = atom({
  key: 'sectorComp',
  default: '',
})
