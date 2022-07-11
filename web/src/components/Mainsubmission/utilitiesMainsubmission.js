export function popCompany(plotData, index) {
  // If there is no data in the plotData, then return.
  if (Object.keys(plotData).length === 0) {
    return
  }

  // if the index is greater than the length of the array, then it is the last company
  let updatedIndex = index
  let currentCompanyList = plotData['netIncome']['nameCompany']
  let dataLen = plotData['netIncome']['nameCompany'].length
  let company = plotData['netIncome']['companyOrder'][index]
  if (currentCompanyList.includes(company)) {
    updatedIndex = currentCompanyList.indexOf(company)
  } else {
    // nothing to be removed, just return the plotData
    return plotData
  }
  if (updatedIndex === 0 && dataLen === 1) {
    return {}
  } else {
    for (const metric in plotData) {
      let company = plotData[metric]['nameCompany'].splice(updatedIndex, 1)[0]
      for (const companyName in plotData[metric]['data']) {
        if (companyName === company) {
          plotData[metric]['data'].splice(companyName, 1)
        }
      }
    }
  }
  return plotData
}

export function postProcess(data, plotData) {
  // Brining the data into a format that is recognizable by rechart
  // Data format for plotData is in the following format:
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
  const nameCompany = data.companyName
  const metricsArrays = data.metricValues
  const fullMetricNames = data.fullMetricNames
  const metricNames = data.metricNames
  const yearsArray = data.years

  for (var i = 0; i < metricsArrays.length; i++) {
    if (!(metricNames[i] in plotData)) {
      plotData[metricNames[i]] = {}
      plotData[metricNames[i]]['metricName'] = fullMetricNames[i]
      plotData[metricNames[i]]['nameCompany'] = [nameCompany]
      // companyOrder is an array that keeps track of the order that companies have been
      // added to the plotData. companyOrder will never get removed from the array until
      // we delete the last company.
      plotData[metricNames[i]]['companyOrder'] = {}
      plotData[metricNames[i]]['companyOrder'][0] = nameCompany
    } else {
      plotData[metricNames[i]]['nameCompany'].push(nameCompany)
      plotData[metricNames[i]]['companyOrder'][
        plotData[metricNames[i]]['nameCompany'].length - 1
      ] = nameCompany
    }

    if (!('data' in plotData[metricNames[i]])) {
      plotData[metricNames[i]]['data'] = metricsArrays[i].map((item, index) => {
        return {
          name: yearsArray[i][index],
          [nameCompany]: item,
        }
      })
    } else {
      plotData[metricNames[i]]['data'].map((item, index) => {
        item[nameCompany] = metricsArrays[i][index]
        return item
      })
    }
  }
  return plotData
}
