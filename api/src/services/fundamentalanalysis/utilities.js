/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export function numFormatter(num) {
  /* Format the input number into Millions of Dollars */
  // var absNum = Math.abs(num)
  // if (absNum > 999 && absNum < 1000000) {
  //   return (num / 1000).toFixed(1) // convert to K for number from > 1000 < 1 million
  // } else if (absNum > 1000000) {
  return parseFloat((num / 1000000).toFixed(1)) // convert to M for number from > 1 million
  // } else if (absNum < 900) {
  //   return num // if value < 1000, nothing to do
  // }
}

export function discountedCashFlowModelCalculator(FCF, years, gRate, dRate) {
  /*
  This is calculated based on the Discounted Cash Flow model
    FCF: https://stablebread.com/how-to-calculate-the-intrinsic-value-of-a-company-like-warren-buffett/
    years: number of years into the future to make the prediction
    g_rate: growth rate of business in the next years. A value between 0 and 1
    d_rate: discount rate. This can be treasury rate or a rate that you think is viable. A value between 0 and 1
    */
  return (
    ((FCF * (1 + gRate)) / (dRate - gRate)) *
    (1 - ((1 + gRate) / (1 + dRate)) ** years)
  )
}

export function terminalValueCalculator(FCF_N, terminalGrowthRate, dRate) {
  /*
    Refer to the following link for the proof
    https://medium.com/@matthew.wilkinson.mw/proving-the-gordon-growth-model-geometric-series-and-their-applications-c156a4ca0b3d
    FCF_N: FCF on year N
    terminal_g_rate: Terminal Growth Rate
    d_rate:d_rate: This can be treasury rate or a rate that you think is viable. A value between 0 and 1
    */
  return (FCF_N * (1 + terminalGrowthRate)) / (dRate - terminalGrowthRate)
}
