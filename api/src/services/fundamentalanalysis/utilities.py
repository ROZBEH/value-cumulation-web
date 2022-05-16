def dollar_format(unitless):
    """
    Changes the format of the input value into dollar format
    """
    return "${:,.2f}".format(unitless)


def discounted_cash_flow_model_calculator(FCF, years, g_rate, d_rate):
    """
    This is calculated based on the Discounted Cash Flow model
    FCF: https://stablebread.com/how-to-calculate-the-intrinsic-value-of-a-company-like-warren-buffett/
    years: number of years into the future to make the prediction
    g_rate: growth rate of business in the next years. A value between 0 and 1
    d_rate: discount rate. This can be treasury rate or a rate that you think is viable. A value between 0 and 1
    """
    return (FCF * (1 + g_rate) / (d_rate - g_rate)) * (
        1 - ((1 + g_rate) / (1 + d_rate)) ** years
    )


def terminal_value_calculator(FCF_N, terminal_g_rate, d_rate):
    """
    Refer to the following link for the proof
    https://medium.com/@matthew.wilkinson.mw/proving-the-gordon-growth-model-geometric-series-and-their-applications-c156a4ca0b3d
    FCF_N: FCF on year N
    terminal_g_rate: Terminal Growth Rate
    d_rate:d_rate: This can be treasury rate or a rate that you think is viable. A value between 0 and 1
    """
    return FCF_N * (1 + terminal_g_rate) / (d_rate - terminal_g_rate)
