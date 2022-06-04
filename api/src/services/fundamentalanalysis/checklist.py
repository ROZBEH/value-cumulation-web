import datetime
import json
import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import FundamentalAnalysis as fa
from utilities import discounted_cash_flow_model_calculator, terminal_value_calculator


api_key = "30d0838215af7a980b24b41cab12410f"


class Checklist:
    def __init__(self, stock_ticker="AAPL"):
        self.time_now = datetime.datetime.now().strftime("%Y-%m-%d")
        self.ticker = stock_ticker
        self.income_statement = fa.income_statement(
            stock_ticker, api_key, period="annual"
        )
        self.cash_f_statement = fa.cash_flow_statement(
            stock_ticker, api_key, period="annual"
        )
        self.balance_s_statement = fa.balance_sheet_statement(
            stock_ticker, api_key, period="annual"
        )
        self.key_ratios = fa.financial_ratios(stock_ticker, api_key)
        self.key_metrics = fa.key_metrics(stock_ticker, api_key)

        try:
            self.dividend = fa.stock_dividend(
                stock_ticker, api_key, begin="1000-01-01", end=self.time_now
            )
        except:
            self.dividend = None

    def stock_ticker(self):
        return self.ticker

    def metric_delta(self, statement, metric, years=10):
        """
        change in the metric of interest over the years. For example if the net income over the years is
        20, 15, 12, 14, 10 this will return 5, 3, -2, 4
        """
        period_1 = statement.loc[metric][0:-1].values
        period_2 = statement.loc[metric][1:].values
        return (period_1 - period_2)[0:years]

    def revenue_delta(self, years=10):
        """
        This will return the change in the revenue over the years
        """
        return self.metric_delta(self.income_statement, "revenue", years)

    def cost_revenue_delta(self, years=10):
        """
        This will return the change in the cost of revenue over the years
        """
        return self.metric_delta(self.income_statement, "costOfRevenue", years)

    def operating_expenses_delta(self, years=10):
        """
        This will return the change in the operating expenses over the years
        """
        return self.metric_delta(self.income_statement, "operatingExpenses", years)

    def ratio_cost_of_revenue(self, years=10):
        """
        Cost_of_revenue for the company in order to increase $1 in the revenue
        """
        return self.cost_revenue_delta(years) / self.revenue_delta(years)

    def burn_ratio(self, years=10):
        """
        How much a company has to burn in order to make $1 in revenue
        """
        return (
            self.operating_expenses_delta(
                years) + self.cost_revenue_delta(years)
        ) / self.revenue_delta(years)

    def r_and_d_budget_to_revenue(self, years=10):
        """
        Ratio of the r&d budget to revenue
        """
        return (
            self.income_statement.loc["researchAndDevelopmentExpenses"].values[0:years]
            / self.income_statement.loc["revenue"].values[0:years]
        )

    def gross_profit_margin(self, years=10):
        """
        Gross profit margins over the years
        """
        return self.key_ratios.loc["grossProfitMargin"].values[0:years]

    def net_profit_margin(self, years=10):
        """
        Net profit margins over the years
        """
        return self.key_ratios.loc["netProfitMargin"].values[0:years]

    def price_to_earning(self, years=10):
        """
        P/E ratio over the years
        """
        return self.key_ratios.loc["priceEarningsRatio"].values[0:years]

    def debt_ratio(self, years=10):
        """
        Debt Ratio: Total Liability / Total Assets
        """
        return self.key_ratios.loc["debtRatio"].values[0:years]

    def current_ratio(self, years=10):
        """
        currentRatio: Current Assets to Current Liabilities
        """
        return self.key_ratios.loc["currentRatio"].values[0:years]

    def price_to_fcf(self, years=10):
        """
        priceToFreeCashFlowsRatio: Price of Share over Free Cashflow per share
        """
        return self.key_ratios.loc["priceToFreeCashFlowsRatio"].values[0:years]

    def free_cash_flow(self, years=10):
        """
        Free cash flow over the years
        """
        return self.cash_f_statement.loc["freeCashFlow"].values[0:years]

    def free_cash_flow_to_net_income(self, years=10):
        """
        cash flow to net income ratio
        """
        return (
            self.cash_f_statement.loc["freeCashFlow"].values[0:years]
            / self.income_statement.loc["netIncome"].values[0:years]
        )

    def operating_cf_to_current_liability(self, years=10):
        """
        Operating Cash Flow to Current Liabilities Ratio
        """
        return (
            self.cash_f_statement.loc["operatingCashFlow"].values[0:years]
            / self.balance_s_statement.loc["totalCurrentLiabilities"].values[0:years]
        )

    def dividend_yield(self, years=10):
        """
        Dividend Payer or Price Compounder: We can use dividend yield in order to get a sense of this.
        Dividend_yield equals dividend per share divided by the price per share
        """
        return self.key_ratios.loc["dividendYield"].values[0:years]

    def income_tax_to_net_income(self, years=10):
        """
        Does the income tax go higher as the net income?
        I cross checked this value on Yahoo Finance and this matches with the following ratio
        (Tax Provision) to (Net Income from Continuing Operation Net Minority Interest)
        """
        return (
            self.income_statement.loc["incomeTaxExpense"].values[0:years]
            / self.income_statement.loc["netIncome"].values[0:years]
        )

    def return_on_retained_earning(self, years=10):
        """
        Return on retained earnings =
        (most recent EPS - first period EPS) / (cumulative EPS for the period - cumulative dividends paid for the period)
        """
        if self.dividend:
            cumulative_dividend = self.dividend["adjDividend"].values[0:years].sum(
            )
        else:
            cumulative_dividend = 0
        return (
            self.income_statement.loc["epsdiluted"].values[0]
            - self.income_statement.loc["epsdiluted"].values[years - 1]
        ) / (
            self.income_statement.loc["epsdiluted"].values[0:years].sum()
            - cumulative_dividend
        )

    def market_cap_change_with_retained_earning(self, years=10):
        """
        How does a company's market cap change on $1 of retained earnings?
        You would want the ratio to be greater than 1. A ratio of X means that the company
        converts $1 of retained earning into $X in market Cap.
        """
        market_cap_change_aapl = self.metric_delta(
            self.key_metrics, "marketCap", years)
        retained_earn_aapl = self.balance_s_statement.loc["retainedEarnings"].values[
            1: years + 1
        ]
        market_cap_vs_retained_earning = market_cap_change_aapl / retained_earn_aapl
        return market_cap_vs_retained_earning

    def mean_net_income_growth_rate(self, years=10):
        """
        What's the average rate of change in net income
        """
        net_income_delta = self.metric_delta(
            self.income_statement, "netIncome", years)
        growth_rate = np.mean(
            net_income_delta
            / self.income_statement.loc["netIncome"].values[1: years + 1]
        )
        return growth_rate

    def mean_FCF_growth_rate(self, years=10):
        """
        What's the average rate of change in free cash flow
        """
        FCF_delta = self.FCF()[0:years] - self.FCF()[1: years + 1]
        FCF_growth_aapl = np.mean(FCF_delta / self.FCF()[1: years + 1])
        return FCF_growth_aapl

    def FCF(self, years=10):
        """
        Returns the free cash flow of the company which is capitalExpenditure + operatingCashFlow
        """
        FCF = self.cash_f_statement.loc["freeCashFlow"].values[0: years + 1]
        return FCF

    def intrinsic_value(
        self,
        years=10,
        d_rate=0.1,
        confidence=1.0,
        terminal_g_rate=0.01,
        growth_multiple="MIN",
        include_terminal_value=True,
    ):
        """
        Given the financials of the company, what's the intrinsic value of this business?
        years: Number of years into the future to make the calculations
        d_rate: Best low risk rate of return that you could achieve on the capital. It could be
            return of s&p500 or treasury rate. Whichever you're 100% sure that you can achieve
            that return without risk of losing your capital.
        confidence: How much confident are you with these numbers. A value between 0 and 1
        growth_multiple: Do you want to consider the MIN of (FCF, net_income) as your
            growth rate or the MAX of these two values?
        """
        mean_FCF_growth_rate = self.mean_FCF_growth_rate(years)
        mean_net_income_growth_rate = self.mean_net_income_growth_rate(years)
        growth_rate = max(mean_FCF_growth_rate, mean_net_income_growth_rate)
        if growth_multiple == "MIN":
            growth_rate = min(mean_FCF_growth_rate,
                              mean_net_income_growth_rate)
        # Discounted Cash flow model
        DCF = discounted_cash_flow_model_calculator(
            self.FCF()[0],
            years=years,
            g_rate=growth_rate,
            d_rate=d_rate,
        )
        FCF_N = self.FCF(years)[0] * \
            (((1 + growth_rate) / (1 + d_rate)) ** years)
        terminal_value = terminal_value_calculator(
            FCF_N, terminal_g_rate, d_rate)
        if include_terminal_value:
            intrinsic_value = terminal_value + DCF
        else:
            intrinsic_value = DCF

        return intrinsic_value * confidence


checklist = Checklist(sys.argv[1])
output = {"intrinsic_value": checklist.intrinsic_value(),
          "FCF": list(checklist.FCF())}
logging_output = json.dumps(output)
print(logging_output)
