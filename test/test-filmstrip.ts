import { Filmstrip } from '../src/filmstrip'
import anyTest, { TestInterface } from 'ava'
const test = anyTest as TestInterface<{mycontext: any}>

test('primitive-just', t => {
  const primitives = Filmstrip.normalize([1, 5, 10], { interval: 2 })
  t.deepEqual(primitives, [1, 1, 5, 5, 10, 10])
})

test('primitive', t => {
  const primitives = Filmstrip.normalize([1, 5, 10], { interval: 3 })
  t.deepEqual(primitives, [1, 5, 5, 10])
})

test('primitive-sort', t => {
  const primitives = Filmstrip.normalize([10, 5, 1], { interval: 3, sorted: false })
  t.deepEqual(primitives, [1, 5, 5, 10])
})

test('primitive-feedback', t => {
  const normalized: number[] = []
  const primitives = Filmstrip.normalize([1, 5, 10], { interval: 3, feedbackTime: (frame, t) => normalized.push(t) })
  t.deepEqual(normalized, [0, 3, 6, 9])
  t.deepEqual(primitives, [1, 5, 5, 10])
})

test('primitive-feedback-scale2', t => {
  const normalized: number[] = []
  const primitives = Filmstrip.normalize([1, 5, 10], { interval: 3, scale: 2, feedbackTime: (frame, t) => normalized.push(t) })
  t.deepEqual(normalized, [0, 3, 6, 9, 12, 15, 18, 21])
  t.deepEqual(primitives, [1, 1, 5, 5, 5, 10, 10, 10])
})

test('primitive-feedback-scale.5', t => {
  const normalized: number[] = []
  const primitives = Filmstrip.normalize([1, 5, 10, 15], { interval: 3, scale: 0.5, feedbackTime: (frame, t) => normalized.push(t) })
  t.deepEqual(normalized, [0, 3, 6, 9])
  t.deepEqual(primitives, [1, 5, 10, 15])
})

test('objects', t => {
  const objects = Filmstrip.normalize([
    { time: 1 },
    { time: 5 },
    { time: 10 },
  ], {
    interval: 3,
    frameTime: frame => frame.time,
  })
  t.deepEqual(objects, [
    { time: 1 },
    { time: 5 },
    { time: 5 },
    { time: 10 },
  ])
})

test('objects-sort', t => {
  const objects = Filmstrip.normalize([
    { time: 10 },
    { time: 5 },
    { time: 1 },
  ], {
    interval: 3,
    sorted: false,
    frameTime: frame => frame.time,
  })
  t.deepEqual(objects, [
    { time: 1 },
    { time: 5 },
    { time: 5 },
    { time: 10 },
  ])
})