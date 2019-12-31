Simple animation encoder from sequential images to short gif or mp4 with ffmpeg.

```js
import { Animator } from 'stopmotion-animator'
import Fs from 'fs'

(async () => {
  const animator = await Animator.start({ frames: 20 })

  const source = [
    'path/to/frame00.png',
    'path/to/frame01.png',
    // snip
    'path/to/frame19.png',
  ]

  // Put them as placeholders
  for (let i = 0; i < 20; i++) {
    Fs.copyFileSync(source[i], animator.placeholders[i]) // or download from cloud
  }

  // Use the templorary file
  await animator.withResult(output => {
    Fs.copyFileSync(output, 'path/to/result.gif') // or upload to cloud
  })
})()
```

# Options

* `frames` Count of source images. Required.
* `useBundle` To use bundled ffmpeg static built. Only for linux amd64.
* `ffmpegPath` To specify ffmpeg path. Default `ffmpeg` depends on `$PATH`.
* `fps` Frames per second.
* `inputFormat` Source image format. `jpg` or `png`. Default `jpg`.
* `outputFormat` Output video format. `gif` or `mp4`. Default `mp4`.
+ `backgroundColor` Background color for source transparency. Name or '#RRGGBB'. Default `white`.
* `timeout` Timeout to encode. Default 30000 (30 sec).
* `frameDigits` Placeholder filename digits. Default 3 to `frame-000.jpg`.
