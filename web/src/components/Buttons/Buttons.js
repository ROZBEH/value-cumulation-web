import React from 'react'
const BUTTONS = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 2, title: 'Burn Ratio', value: 'burnRatio' },
  { id: 3, title: 'Net Income', value: 'netIncome' },
]
export class Mapping extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: ['netIncome'],
    }
    this.props.metrics(this.state.values)
  }

  handleButton = (button) => {
    let tmp = this.state.values
    if (this.state.values.includes(button)) {
      this.setState({
        values: this.state.values.filter((el) => el !== button),
      })
    } else {
      tmp.push(button)
      this.setState({
        values: tmp,
      })
    }
  }

  render() {
    return (
      <div>
        {BUTTONS.map((bt) => (
          <button
            key={bt.id}
            onClick={() => this.handleButton(bt.value)}
            className={
              this.state.values.includes(bt.id) ? 'buttonPressed' : 'button'
            }
            value={bt.value}
            style={{
              backgroundColor: this.state.values.includes(bt.value)
                ? 'springgreen'
                : 'gainsboro',
            }}
          >
            {bt.title}
          </button>
        ))}
      </div>
    )
  }
}
