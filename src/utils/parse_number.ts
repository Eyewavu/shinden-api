export default function parseNumber(input: string):number {
  const str =input.replace(/,/,".")
  const n =parseFloat(str)
  return isNaN(n) ? 0 : n
}