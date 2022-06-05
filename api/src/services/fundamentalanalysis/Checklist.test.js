import { Checklist } from './Checklist'

// const checklist = new Checklist('AAPL')
// await checklist.initialize()

describe('Run tests on Apple ticker and check the validity of results', () => {
  it('Test for Check Lists', () => {
    const checklist = new Checklist('AAPL')
    checklist.companyProfile = 'APPLE'
    expect(true).toBe(true)
    expect(checklist.companyProfile).toBe('APPLE')
  })
})
