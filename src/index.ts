import TmpPromise from 'tmp-promise'
import Path from 'path'
import Execa from 'execa'

export type InputFormat = 'jpg'|'png'
export type OutputFormat = 'gif'|'mp4'

export class Animator {
  frames = 1
  useBundle = false
  ffmpegPath: string = 'ffmpeg'
  fps: number = 30
  inputFormat: InputFormat = 'jpg'
  outputFormat: OutputFormat = 'mp4'
  frameDigits = 3
  backgroundColor = 'white'
  timeout = 30 * 1000

  tmp?: TmpPromise.DirectoryResult
  placeholders: string[] = []
  output: string = ''

  constructor(values: Partial<Animator> = {}) {
    Object.assign(this, values)
  }

  static async start(values: Partial<Animator> = {}) {
    const animator = new Animator(values)
    await animator.start()
    return animator
  }

  async start(): Promise<string[]> {
    const tmp = this.tmp = await TmpPromise.dir({ unsafeCleanup: true })

    this.placeholders = [...Array(this.frames).keys()].map(i => {
      const digits = i.toString().padStart(this.frameDigits, '0')
      const path = Path.join(tmp.path, `frame-${digits}.${this.inputFormat}`)
      return path
    })

    return this.placeholders
  }

  async render(): Promise<string> {
    const tmp = this.tmp = this.tmp || await TmpPromise.dir()
    this.output = Path.join(tmp.path, `animation.${this.outputFormat}`)

    let backgroundColor = this.backgroundColor.replace(/^#+/, '')

    const pattern = Path.join(tmp.path, `frame-%0${this.frameDigits}d.${this.inputFormat}`)
    const options = [
      '-f', 'lavfi', '-i', `color=${backgroundColor}`,
      '-i', pattern,
      '-filter_complex', '[0][1]scale2ref[bg][gif];[bg]setsar=1[bg];[bg][gif]overlay=shortest=1'
    ]

    if (this.outputFormat == 'gif') {
      //
    } else if (this.outputFormat == 'mp4') {
      options.push('-pix_fmt', 'yuv420p')
    }

    options.push('-f', this.outputFormat, this.output)

    const ffmpeg = this.useBundle ? Path.join(__dirname, '..', 'bin/ffmpeg') : this.ffmpegPath
    await Execa(ffmpeg, options, { timeout: this.timeout })

    return this.output
  }
  
  async withResult(cb: (outputPath: string) => Promise<any>) {
    try {
      const path = await this.render()
      await cb(path)
    } catch(ex) {
      throw ex
    } finally {
      await this.finish()
    }
  }

  async finish() {
    if (this.tmp) await this.tmp.cleanup()
  }
}