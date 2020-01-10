export type PictureTimeCallback = (frame:any) => number
export type FeedbackTimeCallback = (frame:any, time:number) => void

export class Filmstrip {
  sorted: boolean = true
  interval: number = 40 // 25 fps
  scale: number = 1
  frameTime: PictureTimeCallback = (frame => <number>frame)
  feedbackTime? :FeedbackTimeCallback

  constructor(values: Partial<Filmstrip> = {}) {
    Object.assign(this, values)
  }

  normalize(frames: any[]) {
    if (!this.sorted) {
      frames = frames.sort((a, b) => this.frameTime(a) - this.frameTime(b))
    }
  
    const equalIntervals:any[] = []
    const lastSampleTime = this.frameTime(frames[frames.length - 1]) * this.scale
    const duration = Math.round(lastSampleTime / this.interval) * this.interval
  
    let i = 0
    for (let t = 0; t <= duration ; t += this.interval) {
      const currentSample: any = frames[i]
      const currentTime = this.frameTime(currentSample) * this.scale
      const nextSample: any = i < frames.length - 1 ? frames[i+1] : null
      const nextTime: number = nextSample ? this.frameTime(nextSample) * this.scale : Infinity
  
      if (Math.abs(currentTime - t) < Math.abs(nextTime - t)) {
        equalIntervals.push(currentSample)
        if (this.feedbackTime) this.feedbackTime(currentSample, t)
      } else {
        equalIntervals.push(nextSample)
        if (this.feedbackTime) this.feedbackTime(nextSample, t)
        i++
      }
    }
  
    return equalIntervals
  }

  static normalize(frames: any[], options: Partial<Filmstrip> = {}) {
    const filmstrip = new Filmstrip(options)
    return filmstrip.normalize(frames)
  }
}
