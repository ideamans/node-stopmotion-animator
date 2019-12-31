import { Animator } from '../src/index'
import Path from 'path'
import Fsx from 'fs-extra'
const GifyParse = require('gify-parse')
import FileType from 'file-type'

import anyTest, { TestInterface } from 'ava'
const test = anyTest as TestInterface<{indexes: number[], sources: string[]}>

test.beforeEach(t => {
  t.context.indexes = [...Array(20).keys()]
  t.context.sources = t.context.indexes.map(i => i + 1).map(i => {
    const index = i.toString().padStart(2, '0')
    return Path.join(__dirname, 'files/bounce-ball', `frame_apngframe${index}.png`)
  })
})

test('gif', async t => {
  const animator = await Animator.start({ frames: 20, fps: 5, inputFormat: 'png', outputFormat: 'gif' })

  await Promise.all(t.context.indexes.map(i => {
    return Fsx.copyFile(t.context.sources[i], animator.placeholders[i])
  }))

  const previewPath = Path.join(__dirname, 'preview', 'bounce-ball.gif')
  await animator.withResult(async outputPath => {
    return Fsx.copyFile(outputPath, previewPath)
  })

  const info = GifyParse.getInfo(await Fsx.readFile(previewPath))
  t.true(info.animated)
  t.is(info.images.length, 20)
})

test('background color yellow', async t => {
  const animator = await Animator.start({ frames: 20, fps: 5, inputFormat: 'png', outputFormat: 'gif', backgroundColor: 'yellow' })

  await Promise.all(t.context.indexes.map(i => {
    return Fsx.copyFile(t.context.sources[i], animator.placeholders[i])
  }))

  const previewPath = Path.join(__dirname, 'preview', 'bounce-ball-yellow.gif')
  await animator.withResult(async outputPath => {
    return Fsx.copyFile(outputPath, previewPath)
  })

  const info = GifyParse.getInfo(await Fsx.readFile(previewPath))
  t.true(info.animated)
  t.is(info.images.length, 20)
})

test('background color RGB red', async t => {
  const animator = await Animator.start({ frames: 20, fps: 5, inputFormat: 'png', outputFormat: 'gif', backgroundColor: '#ff0000' })

  await Promise.all(t.context.indexes.map(i => {
    return Fsx.copyFile(t.context.sources[i], animator.placeholders[i])
  }))

  const previewPath = Path.join(__dirname, 'preview', 'bounce-ball-rgb-red.gif')
  await animator.withResult(async outputPath => {
    return Fsx.copyFile(outputPath, previewPath)
  })

  const info = GifyParse.getInfo(await Fsx.readFile(previewPath))
  t.true(info.animated)
  t.is(info.images.length, 20)
})

test('mp4', async t => {
  const animator = await Animator.start({ frames: 20, fps: 5, inputFormat: 'png', outputFormat: 'mp4' })

  await Promise.all(t.context.indexes.map(i => {
    return Fsx.copyFile(t.context.sources[i], animator.placeholders[i])
  }))

  const previewPath = Path.join(__dirname, 'preview', 'bounce-ball.mp4')
  await animator.withResult(async outputPath => {
    return Fsx.copyFile(outputPath, previewPath)
  })

  const buffer = await Fsx.readFile(previewPath)
  const detectedType = FileType(buffer)

  t.not(detectedType, undefined)
  if (detectedType) t.is(detectedType.mime, 'video/mp4')
})

