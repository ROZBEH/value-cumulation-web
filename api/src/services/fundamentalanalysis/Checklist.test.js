/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { readCSV } from 'danfojs-node'
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to'

import { Checklist } from './Checklist'
expect.extend({ toBeDeepCloseTo })

// Example of saving a fixture to a file
// toCSV(this.companyProfile, {
//   filePath: 'api/fixtures/companyProfile.csv', sep: ';',
// })

describe("Run tests on Apple' stock and check the validity of results", () => {
  it('Test for Check Lists', async () => {
    let years
    const checklist = new Checklist('AAPL')
    checklist.dfIncomeStatement = await readCSV(
      'api/fixtures/dfIncomeStatement.csv',
      {
        delimiter: ';',
      }
    )
    checklist.dfBalanceSheetStatement = await readCSV(
      'api/fixtures/dfBalanceSheetStatement.csv',
      {
        delimiter: ';',
      }
    )
    checklist.dfCashFlowStatement = await readCSV(
      'api/fixtures/dfCashFlowStatement.csv',
      {
        delimiter: ';',
      }
    )
    checklist.dfDividend = await readCSV('api/fixtures/dfDividend.csv')
    checklist.dfFinancialRatios = await readCSV(
      'api/fixtures/dfFinancialRatios.csv',
      {
        delimiter: ';',
      }
    )
    checklist.dfKeyMetrics = await readCSV('api/fixtures/dfKeyMetrics.csv', {
      delimiter: ';',
    })
    checklist.companyProfile = await readCSV(
      'api/fixtures/companyProfile.csv',
      {
        delimiter: ';',
      }
    )

    // companyName
    expect(checklist.companyName()).toMatch(/Apple Inc/)
    // ticker
    expect(checklist.ticker).toMatch(/AAPL/)
    //net income

    // metricDelta
    expect(
      checklist.metricDelta(checklist.dfIncomeStatement, 'revenue', 1)
    ).toEqual([91302000000])

    // revenueDelta
    years = 1
    expect(checklist.revenueDelta(years)).toEqual([91302000000])

    // costRevenueDelta
    years = 1
    expect(checklist.costRevenueDelta(years)).toEqual([43422000000])

    // operatingExpensesDelta
    years = 1
    expect(checklist.operatingExpensesDelta(years)).toEqual([5219000000])

    // ratioCostOfRevenue
    expect(checklist.ratioCostOfRevenue()).toBeDeepCloseTo([
      0.4755865150818164, 0.5422913325430584, 0.3641394576646375,
      0.6245152773576085, 0.7114380286870173, 0.4820203584863908,
      0.5465632364493322, 0.4755574253260412, 1.3025968615470074,
      0.4851944714975445,
    ])

    // burnRatio
    expect(checklist.burnRatio()).toBeDeepCloseTo([
      0.5327484611509058, 0.8355763196429816, -0.2853717026378897,
      0.7372459503313991, 0.9029054799558661, 0.3800619606107546,
      0.6322270227808326, 0.7051745898190998, 1.433412026107485,
      0.5555026005511925,
    ])

    // rAndDBudgetToRevenue
    expect(checklist.rAndDBudgetToRevenue()).toBeDeepCloseTo([
      0.059904269074427925, 0.06830956414039306, 0.06233136285716482,
      0.05360040663416103, 0.05052042890670668, 0.046582482760539605,
      0.034516398177267184, 0.03304794988922016, 0.02618337136504593,
      0.02160272957292918,
    ])

    // grossProfitMargin
    expect(checklist.grossProfitMargin()).toBeDeepCloseTo([
      0.4177935962516778, 0.38233247727810865, 0.3781776810903472,
      0.38343718820007905, 0.38469860491899105, 0.3907595564809705,
      0.4005990201741437, 0.3858803577778386, 0.3762448072084723,
      0.4387123980882766,
    ])

    // netProfitMargin
    expect(checklist.netProfitMargin()).toBeDeepCloseTo([
      0.2588179335569424, 0.20913611278072236, 0.21238094505984456,
      0.22414202074587247, 0.21092420845075338, 0.211867983064288,
      0.22845773698735639, 0.21614376760852322, 0.21670469837926393,
      0.26665090602397323,
    ])

    // priceToEarning
    expect(checklist.priceToEarning()).toBeDeepCloseTo([
      26.219656246078664, 34.773150493918536, 20.813514843118142,
      17.66691697269503, 17.989671076916714, 14.088076980322631,
      12.421889592088998, 16.189685470007593, 13.23850197593347,
      13.529582274049602,
    ])

    // debtRatio
    expect(checklist.debtRatio()).toBeDeepCloseTo([
      0.8202574344305731, 0.7982666847799239, 0.7326921031797611,
      0.7070285050242668, 0.6428451530564666, 0.6013224075651412,
      0.5891097118896719, 0.5188600709975457, 0.4031449275362319,
      0.32859641948382406,
    ])

    // currentRatio
    expect(checklist.currentRatio()).toBeDeepCloseTo([
      1.0745531195957954, 1.3636044481554577, 1.540125617208044,
      1.1238426916297297, 1.2760628484139107, 1.352669417512594,
      1.1087706239920605, 1.0801128483167317, 1.6786385084062485,
      1.4958486845519174,
    ])

    // priceToFreeCashFlowsRatio
    expect(checklist.priceToFreeCashFlowsRatio()).toBeDeepCloseTo([
      26.706798633489267, 27.211358863304806, 19.527159334612467,
      16.40225876548257, 17.121402008542802, 12.31237992577856,
      9.505207556536444, 12.818726912224449, 10.996061845316168,
      13.620641121313069,
    ])

    // freeCashFlow
    expect(checklist.freeCashFlow()).toEqual([
      92953000000, 73365000000, 58896000000, 64121000000, 50803000000,
      52276000000, 69778000000, 49900000000, 44590000000, 41454000000,
    ])

    // operatingCashFlow
    expect(checklist.operatingCashFlow()).toEqual([
      104038000000, 80674000000, 69391000000, 77434000000, 63598000000,
      65824000000, 81266000000, 59713000000, 53666000000, 50856000000,
    ])

    // freeCashFlowToNetIncome
    expect(checklist.freeCashFlowToNetIncome()).toBeDeepCloseTo([
      0.981759611322349, 1.2778909964989287, 1.065875199073404,
      1.0771026859955317, 1.0507124981903166, 1.1442204565850242,
      1.306850957036371, 1.2629713996456593, 1.203931203931204,
      0.9933146430882036,
    ])

    // operatingCFToCurrentLiabilities
    expect(checklist.operatingCFToCurrentLiabilities()).toBeDeepCloseTo([
      0.8291135709788733, 0.7654660695308941, 0.6563782894114532,
      0.662587921208906, 0.6308449223322158, 0.8331519125129737,
      1.0081379481453914, 0.9411328962299836, 1.2292363369829127,
      1.319495615173058,
    ])

    // dividendYield
    expect(checklist.dividendYield()).toBeDeepCloseTo([
      0.005827647019057021, 0.007053332328502797, 0.012276627205241504,
      0.013037576167697424, 0.014680072605940824, 0.01887695412927957,
      0.017430718096587184, 0.017393765651649715, 0.021545359569142133,
      0.004406425001584553,
    ])

    // incomeTaxToNetIncome
    expect(checklist.incomeTaxToNetIncome()).toBeDeepCloseTo([
      0.15343261512463033, 0.1686088031910261, 0.18968075865064427,
      0.2246224656061548, 0.3254948191350748, 0.3433142907172719,
      0.35811139828445143, 0.3536573019488737, 0.3541863541863542,
      0.3361847938082573,
    ])

    // returnOnRetainedEarnings
    expect(checklist.returnOnRetainedEarnings()).toBeDeepCloseTo(
      0.19246788685504723
    )

    // marketCapChangeWithRetainedEarnings
    expect(checklist.marketCapChangeWithRetainedEarnings()).toBeDeepCloseTo([
      32.48133839184624, 18.438488971960027, 1.3969082651964204,
      1.8500015057612929, 2.3471069407662615, -0.21252221273460187,
      0.2707901133651551, 1.432436264937769, -0.7336992107757411,
      3.0170411194737197,
    ])

    // meanNetIncomeGrowthRate
    expect(checklist.meanNetIncomeGrowthRate()).toBeDeepCloseTo(
      0.16771399797728725
    )

    // meanFCFGrowthRate
    expect(checklist.meanFCFGrowthRate()).toBeDeepCloseTo(0.13856803205605892)

    // intrinsicValue_1
    expect(checklist.intrinsicValue()).toBeDeepCloseTo([2601355093012.6797])

    // intrinsicValue_2
    expect(
      checklist.intrinsicValue(
        //years
        10,
        //dRate
        0.1,
        //confidence
        0.5,
        //terminalGrowthRate
        0.01,
        //growthMultiple
        'MIN',
        //includeTerminalValue
        true
      )
    ).toBeDeepCloseTo([1300677546506.3398])

    // intrinsicValue_3
    expect(
      checklist.intrinsicValue(
        //years
        10,
        //dRate
        0.1,
        //confidence
        1,
        //terminalGrowthRate
        0.01,
        //growthMultiple
        'MIN',
        //includeTerminalValue
        false
      )
    ).toBeDeepCloseTo([1129024684255.568])

    // intrinsicValue_4
    expect(
      checklist.intrinsicValue(
        //years
        10,
        //dRate
        0.1,
        //confidence
        1,
        //terminalGrowthRate
        0.01,
        //growthMultiple
        'MAX',
        //includeTerminalValue
        true
      )
    ).toBeDeepCloseTo([3205918429421.493])
  })
})
