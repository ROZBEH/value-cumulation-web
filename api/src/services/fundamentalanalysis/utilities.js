export function numFormatter(num) {
  // var absNum = Math.abs(num)
  // if (absNum > 999 && absNum < 1000000) {
  //   return (num / 1000).toFixed(1) // convert to K for number from > 1000 < 1 million
  // } else if (absNum > 1000000) {
  return (num / 1000000).toFixed(1) // convert to M for number from > 1 million
  // } else if (absNum < 900) {
  //   return num // if value < 1000, nothing to do
  // }
}
