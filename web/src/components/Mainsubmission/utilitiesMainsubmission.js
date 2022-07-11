export function popCompany(plotData, index) {
  // Remove the company from the plotData if the index is given
  // If the index is not given, remove the last company
  let company
  for (const metric in plotData) {
    // If only one company is in the plotData, return an empty
    // object onlyif the index is given as a number
    if (plotData[metric]['nameCompany'].length === 1) {
      if (typeof index === 'number') {
        return {}
      } else {
        return plotData
      }
    }
    if (index) {
      company = plotData[metric]['nameCompany'].splice(index, 1)[0]
    } else {
      company = plotData[metric]['nameCompany'].pop()
    }
    for (const companyName in plotData[metric]['data']) {
      if (companyName === company) {
        plotData[metric]['data'].splice(companyName, 1)
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
    } else {
      plotData[metricNames[i]]['nameCompany'].push(nameCompany)
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
