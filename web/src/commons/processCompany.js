/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

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
      var seqNum = plotData[metric]['companyOrder'][company]
      delete plotData[metric]['companyOrder'][company]
      delete plotData[metric]['companyOrder'][seqNum]
      // remove the specific stroke width
      plotData[metric]['strokeWidth'].splice(updatedIndex, 1)
      for (const companyName in plotData[metric]['data']) {
        if (companyName === company) {
          plotData[metric]['data'].splice(companyName, 1)
        }
      }
    }
  }
  return plotData
}

export function preparePlotData(data, plotData, index, strokeWidth) {
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
  if (strokeWidth === undefined) {
    strokeWidth = 1
  }
  const nameCompany = data.companyName
  const metricsArrays = data.metricValues
  const fullMetricNames = data.fullMetricNames
  const metricNames = data.metricNames
  const metricsDescription = data.metricsDescription
  const yearsArray = data.years
  for (var i = 0; i < metricsArrays.length; i++) {
    if (!(metricNames[i] in plotData)) {
      plotData[metricNames[i]] = {}
      plotData[metricNames[i]]['metricName'] = fullMetricNames[i]
      plotData[metricNames[i]]['nameCompany'] = [nameCompany]
      plotData[metricNames[i]]['strokeWidth'] = [strokeWidth]
      plotData[metricNames[i]]['description'] = metricsDescription[i]
      // companyOrder is an Object that keeps track of the order that companies have been
      // added to the plotData. companyOrder will never get removed from the array until
      // we delete the last company. It contains both key:value and value:key pairs.
      plotData[metricNames[i]]['companyOrder'] = {}
    } else {
      plotData[metricNames[i]]['nameCompany'].push(nameCompany)
      plotData[metricNames[i]]['strokeWidth'].push(strokeWidth)
    }
    plotData[metricNames[i]]['companyOrder'][index] = nameCompany
    plotData[metricNames[i]]['companyOrder'][nameCompany] = index

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

export function postProcess(
  fudamentals,
  currentSearchBox,
  pltData,
  setPltData,
  setSECReports
) {
  let plotData = preparePlotData(
    fudamentals,
    JSON.parse(JSON.stringify(pltData)),
    currentSearchBox
  )
  // Clean up the SEC report data and save it as an object
  // The format of the report will be
  /*
  {
    'APPLE': {'10K': { 'link':[l1, l2, ...],
                        'fillingDate': [d1, d2, ...]
                      },
              '10Q': { 'link':[l1, l2, ...],
                        'fillingDate': [d1, d2, ...],
                    },
              },
    'GOOGLE': {'10K': { 'link':[l1, l2, ...]
                        'fillingDate': [d1, d2, ...]
                      },
              '10Q': { 'link':[l1, l2, ...],
                        'fillingDate': [d1, d2, ...],
                    },
              },

  }
  */
  const tmpSECReports = fudamentals.secReports
  const secReportCompany = {}
  for (let i = 0; i < tmpSECReports.length; i++) {
    if (tmpSECReports[i].type in secReportCompany) {
      secReportCompany[tmpSECReports[i].type].push({
        link: tmpSECReports[i]['finalLink'],
        fillingDate: tmpSECReports[i]['fillingDate'],
      })
    } else {
      secReportCompany[tmpSECReports[i].type] = [
        {
          link: tmpSECReports[i]['finalLink'],
          fillingDate: tmpSECReports[i]['fillingDate'],
        },
      ]
    }
  }
  setSECReports((secReport) => ({
    ...secReport,
    [plotData['netIncome']['nameCompany'].slice(-1)]: secReportCompany,
  }))
  setPltData(plotData)
  return <> </>
}
