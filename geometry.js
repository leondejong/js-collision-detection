// Formatted by StandardJS

// Computational Geometry

const generateVertices = (x = 0, y = 0, n = 3, r = 30, a = 0) => {
  const v = []
  for (i = 0; i < n; i++) {
    v.push({
      x: Math.sin((Math.PI * 2 * i) / n + a) * r + x,
      y: Math.cos((Math.PI * 2 * i) / n + a) * r + y
    })
  }
  return v
}

const randomizedVertices = (
  x = 0,
  y = 0,
  r = 30,
  n = 3,
  m = 5,
  l = 0.33,
  h = 0.67
) => {
  const s = random(n - 1, m)
  const t = Math.random() * Math.PI * 2
  const p = generateVertices(x, y, s, r, t)
  return p.map(({ x: dx, y: dy }) => ({
    x: dx + (x - dx) * random(l, h),
    y: dy + (y - dy) * random(l, h)
  }))
}

const getBounds = vertices => {
  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity

  vertices.forEach(v => {
    if (v.x < xMin) xMin = v.x
    if (v.x > xMax) xMax = v.x
    if (v.y < yMin) yMin = v.y
    if (v.y > yMax) yMax = v.y
  })

  return { xMin, xMax, yMin, yMax }
}

const getBox = b => [
  { x: b.xMin, y: b.yMin },
  { x: b.xMax, y: b.yMax }
]

const getRectangle = b => ({
  x: b.xMin,
  y: b.xMax,
  width: b.xMax - b.xMin,
  height: b.yMax - b.yMin
})

const getRectangleVertices = b => [
  { x: b.xMin, y: b.yMin },
  { x: b.xMax, y: b.yMin },
  { x: b.xMax, y: b.yMax },
  { x: b.xMin, y: b.yMax }
]

const pointLineSide = (p, v) =>
  (p.x - v[0].x) * (v[1].y - v[0].y) - (p.y - v[0].y) * (v[1].x - v[0].x)

const threePointCircle = (u, v, w) => {
  const a = v.x - u.x
  const b = v.y - u.y
  const c = w.x - u.x
  const d = w.y - u.y
  const e = (a * (v.x + u.x)) / 2 + (b * (v.y + u.y)) / 2
  const f = (c * (w.x + u.x)) / 2 + (d * (w.y + u.y)) / 2
  const g = a * d - b * c
  const x = (d * e - b * f) / g
  const y = (-c * e + a * f) / g
  const r = Math.sqrt((u.x - x) * (u.x - x) + (u.y - y) * (u.y - y))
  return { x, y, r }
}

const twoPointCircle = (u, v) => {
  const x = (u.x + v.x) / 2
  const y = (u.y + v.y) / 2
  const r = Math.sqrt((u.x - x) * (u.x - x) + (u.y - y) * (u.y - y))
  return { x, y, r }
}

const boundingCircle = (v, n, b, i) => {
  if (i === 3) {
    return threePointCircle(b[0], b[1], b[2])
  }
  if (n === 0 && i === 2) {
    return twoPointCircle(b[0], b[1])
  }
  if (n === 1 && i === 1) {
    return twoPointCircle(b[0], v[0])
  }
  if (n === 1 && i === 0) {
    return { x: v[0].x, y: v[0].y, r: 0 }
  }
  let c = boundingCircle(v, n - 1, b, i)
  if (!pointCircleCollision(v[n - 1], c)) {
    b[i++] = v[n - 1]
    c = boundingCircle(v, n - 1, b, i)
  }
  return c
}

const getBoundingCircle = vertices =>
  boundingCircle(vertices, vertices.length, [], 0)

const getMaxCircle = shape => {
  const x = shape.centroid.x
  const y = shape.centroid.y
  let r = 0
  shape.vertices.forEach(v => {
    const m = Math.abs(magnitude({ x: v.x - x, y: v.y - y }))
    if (m > r) {
      r = m
    }
  })
  return { x, y, r }
}

const orientation = (p, q, r) => {
  const s1 = (q.y - p.y) * (r.x - q.x)
  const s2 = (q.x - p.x) * (r.y - q.y)
  const v = s1 - s2
  if (v === 0) return 0
  return v > 0 ? 1 : -1
}

const convexHull = v => {
  n = v.length
  if (n < 3) return
  let h = []
  let l = 0
  for (let i = 1; i < n; i++) if (v[i].x < v[l].x) l = i
  let p = l
  let q
  do {
    h.push(v[p])
    q = (p + 1) % n
    for (let i = 0; i < n; i++) {
      if (orientation(v[p], v[i], v[q]) === -1) q = i
    }
    p = q
  } while (p != l)
  return h
}

// https://cglab.ca/~sander/misc/ConvexGeneration/convex.html
const randomConvexPolygon = (n, x = 0, y = 0, r = 90) => {
  const range = Array(n).fill()
  const xRandom = []
  const yRandom = []

  range.map((_, i) => {
    xRandom.push(Math.random())
    yRandom.push(Math.random())
  })

  xRandom.sort()
  yRandom.sort()

  const xMin = xRandom[0]
  const xMax = xRandom[n - 1]
  const yMin = yRandom[0]
  const yMax = yRandom[n - 1]

  let left = xMin
  let right = xMin
  let top = yMin
  let bottom = yMin

  let xVector = []
  let yVector = []

  Array(n - 2)
    .fill()
    .map((_, i) => {
      const x = xRandom[i + 1]
      const y = yRandom[i + 1]
      if (Math.random() < 0.5) {
        xVector.push(x - left)
        left = x
      } else {
        xVector.push(right - x)
        right = x
      }
      if (Math.random() < 0.5) {
        yVector.push(y - top)
        top = y
      } else {
        yVector.push(bottom - y)
        bottom = y
      }
    })

  xVector.push(xMax - left)
  xVector.push(right - xMax)
  yVector.push(yMax - top)
  yVector.push(bottom - yMax)

  xVector = shuffle(xVector)
  // yVector = shuffle(yVector)

  let vectors = range.map((_, i) => ({
    x: xVector[i],
    y: yVector[i]
  }))

  const angle = v => Math.atan2(v.y, v.x)

  vectors.sort((a, b) => (angle(a) > angle(b) ? 1 : -1))

  let vertices = []
  let xn = (yn = xm = ym = 0)

  range.map((_, i) => {
    vertices.push({ x: xn, y: yn })
    xn += vectors[i].x
    yn += vectors[i].y
    xm = Math.min(xn, xm)
    ym = Math.min(yn, ym)
  })

  const xShift = xMin - xm
  const yShift = yMin - ym

  vertices = vertices.map(v => ({
    x: x - r / 2 + (v.x + xShift) * r,
    y: y - r / 2 + (v.y + yShift) * r
  }))

  return vertices
}
