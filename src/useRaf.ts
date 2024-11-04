const isUndef = (val: any) => val === undefined

/**
 * 浏览器在下次重绘之前调用指定的回调函数更新动画
 * @param { Function } fn 函数
 * @param { number } delta 间隔时间
 * @param { boolean } autoStop 自动销毁
 * @returns
 */
export function useRaf(
  fn: (timestamp: number) => void,
  options: {
    delta?: number
    autoStop?: boolean
    immediate?: boolean
  } = {},
): () => void {
  let start: number
  let isStopped = false
  let rafId: number
  const { immediate, delta = 0, autoStop } = options
  const animationFrame
    = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame
    || (fn => setTimeout(fn, 1000 / 60))
  const cancelAnimation
    = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame
    || clearTimeout
  const stop = () => {
    isStopped = true
    cancelAnimation(rafId)
  }
  rafId = animationFrame(function myFrame(timestamp: number) {
    if (isUndef(start)) {
      start = timestamp
      if (immediate) {
        // 首次立即执行
        fn?.(timestamp)
      }
    }
    else if (isStopped) {
      return
    }
    else if (timestamp - start > delta) {
      fn?.(timestamp)
      start = timestamp
      if (autoStop) {
        stop()
        return
      }
    }
    rafId = animationFrame(myFrame)
  })

  return stop
}
