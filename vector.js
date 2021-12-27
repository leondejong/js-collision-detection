// Formatted by StandardJS

// Vector Math

const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y

const dotProductTrig = (m1, m2, a) => m1 * m2 * Math.cos(a)

const crossProductMagnitude = (v1, v2) => v1.x * v2.y - v1.y * v2.x

const crossProductMagnitudeTrig = (m1, m2, a) => m1 * m2 * -Math.sin(a)

const crossVectorScalar = (v, s) => ({ x: s * v.y, y: -s * v.x })

const crossScalarVector = (s, v) => ({ x: -s * v.y, y: s * v.x })

const normalVector = (v1, v2) => ({ x: -(v2.y - v1.y), y: v2.x - v1.x })

const perpendicularLeft = v => ({ x: -v.y, y: v.x })

const perpendicularRight = v => ({ x: v.y, y: -v.x })

const magnitude = v => Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))

const angle = (v1, v2) =>
  Math.acos(dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2)))

const normalizeVector = v => {
  m = magnitude(v)
  return m == 0 ? v : { x: v.x / m, y: v.y / m }
}

const translateVector = (v, d) => ({ x: v.x + d.x, y: v.y + d.y })

const scaleVector = (v, f) => ({ x: v.x * f, y: v.y * f })

const rotateVector = (v, a) => {
  const sin = Math.sin(a)
  const cos = Math.cos(a)
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos
  }
}

const translateVertices = (vs, d) =>
  vs.map(v => ({
    x: v.x + d.x,
    y: v.y + d.y
  }))

const scaleVertices = (vs, c, f) =>
  vs.map(v => ({
    x: (v.x - c.x) * f + c.x,
    y: (v.y - c.y) * f + c.y
  }))

const rotateVertices = (vs, c, a) => {
  const sin = Math.sin(a)
  const cos = Math.cos(a)
  return vs.map(v => ({
    x: (v.x - c.x) * cos - (v.y - c.y) * sin + c.x,
    y: (v.x - c.x) * sin + (v.y - c.y) * cos + c.y
  }))
}

const getAverage = vertices => {
  const l = vertices.length
  let w = 0
  let h = 0
  vertices.forEach(v => {
    w += v.x
    h += v.y
  })
  return { x: w / l, y: h / l }
}

const getCentroid = vertices => {
  const n = vertices.length
  let centroid = { x: 0, y: 0 }
  let area = 0

  vertices.forEach((v, i) => {
    const x0 = v.x
    const y0 = v.y
    const x1 = vertices[(i + 1) % n].x
    const y1 = vertices[(i + 1) % n].y
    const a = x0 * y1 - x1 * y0
    area += a
    centroid.x += (x0 + x1) * a
    centroid.y += (y0 + y1) * a
  })

  area *= 0.5
  centroid.x /= 6.0 * area
  centroid.y /= 6.0 * area

  return centroid
}

const getEdges = vertices =>
  vertices.reduce((a, v, i, l) => {
    const n = (i + 1) % l.length
    return [...a, { x: l[n].x - l[i].x, y: l[n].y - l[i].y }]
  }, [])

const getNormals = edges =>
  edges.reduce((a, v) => {
    return [...a, normalizeVector({ x: -v.y, y: v.x })]
  }, [])

const getProjections = (normal, vertices) =>
  Object.values(vertices).reduce(
    (projection, vertex) => {
      const dot = dotProduct(normal, vertex)
      return {
        ...projection,
        min: Math.min(projection.min, dot),
        max: Math.max(projection.max, dot)
      }
    },
    { min: Infinity, max: -Infinity }
  )

const getCircleAxes = (circle, polygon) => {
  const axes = []
  polygon.vertices.forEach((v, i, l) => {
    axes.push(normalizeVector({ x: v.x - circle.x, y: v.y - circle.y }))
  })
  return axes
}
