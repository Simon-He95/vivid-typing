export interface defaultProps {
  interval?: number
  delay?: number
  infinity?: boolean
  infinityDelay?: number
  finish?: () => void
  spiltTag?: string
  spiltClass?: string
  spiltStyle?: string | ((index: number) => string)
  content?: string | string[]
  stable?: boolean
  scrollX?: boolean
  scrollY?: boolean
  speed?: number
  reverse?: boolean
  tail?: boolean
}
