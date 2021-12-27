// Formatted by StandardJS

// Broad and Narrow Phase example

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width
const height = canvas.height

const speed = 5
const torque = 0.05
const factor = 0.05
const damping = 0.5

const keys = {}
const up = 69 // e
const left = 83 // s
const down = 68 // d
const right = 70 // f
const rotateLeft = 74 // j
const rotateRight = 76 // l
const increase = 73 // i
const decrease = 75 // k
const mode = 77 // m

let shapes = []
let index = 0

let rotation = 0
let radius = 0
let x = 0
let y = 0

const init = () => {
  const r = 75
  const a = 0
  const f1 = 0.33
  const f2 = 0.67
  const shape0 = simpleCircle(0, dark, width * f2, height * f2, r, a)
  const shape3 = complexShape(3, dark, width * f1, height * f1, 3, r, a)
  const shape4 = complexShape(4, dark, width * f2, height * f1, 4, r, a)
  const shape5 = complexShape(5, dark, width * f1, height * f2, 5, r, a)
  shapes = [shape3, shape4, shape5, shape0]
}

const updateProperties = () => {
  const hd = !!keys[right] - !!keys[left]
  const vd = !!keys[down] - !!keys[up]
  const rd = !!keys[rotateLeft] - !!keys[rotateRight]
  const sd = !!keys[increase] - !!keys[decrease]
  rotation = rd * torque
  radius = sd * speed
  x = hd * speed
  y = vd * speed
}

const updatePolygons = () => {
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
  shapes[index] = appendShape(shapes[index], x, y, rotation, radius)
  const collisions = narrowPhase(broadPhase(shapes))
  shapes = shapes.map(s => ({ ...s, color: dark }))
  Object.values(collisions).map((c, i) => {
    let { shape } = c
    const { overlap, mtv } = c
    i = shapes.findIndex(s => s.id === shape.id)
    shape = { ...shape, color: overlap ? green : dark }
    shapes[i] = appendShape(shape, mtv.x * damping, mtv.y * damping)
  })
}

const update = () => {
  updateProperties()
  updatePolygons()
}

const renderText = () => {
  const t = 480
  const l = width - 290
  const r = width - 160
  const s = 20

  ctx.fillStyle = grey
  ctx.font = '12px monospace'

  ctx.fillText('Change Mode:    M', 50, 50 + s * 1)

  ctx.fillText('Move Up:    E', l, t + s * 0)
  ctx.fillText('Move Left:  S', l, t + s * 1)
  ctx.fillText('Move Down:  D', l, t + s * 2)
  ctx.fillText('Move Right: F', l, t + s * 3)

  ctx.fillText('Rotate Left:   J', r, t + s * 0)
  ctx.fillText('Rotate Right:  L', r, t + s * 1)
  ctx.fillText('Increase Size: I', r, t + s * 2)
  ctx.fillText('Decrease Size: K', r, t + s * 3)
}

const render = () => {
  ctx.fillStyle = light
  ctx.fillRect(0, 0, width, height)

  renderText()

  shapes.forEach(s =>
    s.type === polygon
      ? drawPolygon(ctx, s, false, true)
      : drawCircle(ctx, s, false, true)
  )
}

const loop = () => {
  requestAnimationFrame(loop)
  update()
  render()
}

const main = () => {
  init()

  document.onkeydown = function (e) {
    keys[e.which] = true
    if (e.which == mode) index = (index + 1) % shapes.length
  }

  document.onkeyup = function (e) {
    keys[e.which] = false
  }

  window.onload = () => requestAnimationFrame(loop)
}
