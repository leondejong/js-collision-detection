// Formatted by StandardJS

// Graphical Utilities

const polygon = 'polygon'
const circle = 'circle'

const transparent = 'rgba(0, 0, 0, 0)'
const black = 'rgba(0, 0, 0, 1)'
const white = 'rgba(255, 255, 255, 1)'
const dark = 'rgba(31, 31, 31, 1)'
const light = 'rgba(239, 239, 239, 1)'
const grey = 'rgba(127, 127, 127, 1)'
const red = 'rgba(255, 0, 0, 1)'
const green = 'rgba(0, 159, 127, 1)'
const blue = 'rgba(0, 0, 255, 1)'

const simpleCircle = (id, color, x, y, radius, angle) => ({
  type: circle,
  overlap: [],
  mtv: [],
  id,
  color,
  radius,
  angle,
  x,
  y
})

const simplePolygon = (id, color, vertices) => ({
  type: polygon,
  id,
  color,
  vertices
})

const complexPolygon = (id, color, vertices) => {
  const polygon = simplePolygon(id, color, vertices)
  const centroid = getCentroid(vertices)
  const average = getAverage(vertices)
  const box = getBox(getBounds(vertices))
  const edges = getEdges(vertices)
  const normals = getNormals(edges)
  return {
    ...polygon,
    centroid,
    average,
    box,
    edges,
    normals
  }
}

const simpleShape = (n, c, x, y, l, r, a) => {
  const v = generateVertices(x, y, l, r, a)
  return {
    type: polygon,
    vertices: v,
    overlap: [],
    mtv: [],
    id: n,
    color: c,
    length: l,
    radius: r,
    angle: a,
    scale: 1,
    x,
    y
  }
}

const complexShape = (n, c, x, y, l, r, a) => {
  const shape = simpleShape(n, c, x, y, l, r, a)
  const centroid = getCentroid(shape.vertices)
  const average = getAverage(shape.vertices)
  const box = getBox(getBounds(shape.vertices))
  const edges = getEdges(shape.vertices)
  const normals = getNormals(edges)
  return {
    ...shape,
    centroid,
    average,
    box,
    edges,
    normals
  }
}

const updateCircle = c =>
  simpleCircle(c.id, c.color, c.x, c.y, c.radius, c.angle)

const updatePolygon = p => complexPolygon(p.id, p.color, p.vertices)

const updateShape = s =>
  complexShape(s.id, s.color, s.x, s.y, s.length, s.radius, s.angle)

const updateCentroid = polygon => ({
  ...polygon,
  centroid: getCentroid(polygon.vertices)
})

const updateAverage = polygon => ({
  ...polygon,
  average: getAverage(polygon.vertices)
})

const updateBox = polygon => ({
  ...polygon,
  box: getBox(polygon.vertices)
})

const updateEdges = polygon => ({
  ...polygon,
  edges: getEdges(polygon.vertices)
})

const updateNormals = polygon => ({
  ...polygon,
  normals: getNormals(polygon.edges)
})

const translatePolygon = (polygon, delta) => ({
  ...polygon,
  vertices: translateVertices(polygon.vertices, delta)
})

const scalePolygon = (polygon, factor) => ({
  ...polygon,
  vertices: scaleVertices(polygon.vertices, polygon.centroid, factor)
})

const rotatePolygon = (polygon, angle) => ({
  ...polygon,
  vertices: rotateVertices(polygon.vertices, polygon.centroid, angle)
})

const translateShape = (shape, delta) => ({
  ...shape,
  centroid: { x: shape.x + delta.x, y: shape.y + delta.y },
  average: { x: shape.x + delta.x, y: shape.y + delta.y },
  vertices: translateVertices(shape.vertices, delta)
})

const scaleShape = (shape, factor) => ({
  ...shape,
  scale: shape.scale * factor,
  radius: shape.radius * factor,
  vertices: scaleVertices(shape.vertices, shape.centroid, factor)
})

const rotateShape = (shape, angle) => ({
  ...shape,
  angle,
  vertices: rotateVertices(shape.vertices, shape.centroid, angle)
})

const updateShapes = shapes => {
  const s = Object.entries(shapes)
  s.forEach((v, i) => {
    const [n, p] = v
    if (p.type === polygon) {
      shapes[n] = updateShape(p)
    } else {
      shapes[n] = updateCircle(p)
    }
  })
  return shapes
}

const appendShape = (shape, x, y, rotation = 0, radius = 0) => {
  const { id: sn, color: sc, length: sl } = shape
  const sx = shape.x + x
  const sy = shape.y + y
  const sr = shape.radius + radius
  const sa = (shape.angle + rotation) % (Math.PI * 2)
  if (shape.type === polygon) {
    return complexShape(sn, sc, sx, sy, sl, sr, sa)
  } else {
    return simpleCircle(sn, sc, sx, sy, sr, sa)
  }
}

const drawCircle = (ctx, circle, solid = false, orientation = false) => {
  if (solid) {
    ctx.fillStyle = circle.color || black
  } else {
    ctx.strokeStyle = circle.color || black
  }
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
  if (orientation) {
    ctx.moveTo(
      circle.x + circle.radius * Math.sin(circle.angle),
      circle.y + circle.radius * Math.cos(circle.angle)
    )
    ctx.lineTo(circle.x, circle.y)
  }
  if (solid) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

const drawPolygon = (ctx, polygon, solid = false, orientation = false) => {
  if (solid) {
    ctx.fillStyle = polygon.color || black
  } else {
    ctx.strokeStyle = polygon.color || black
  }
  ctx.beginPath()
  if (orientation) {
    ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y)
    ctx.lineTo(polygon.centroid.x, polygon.centroid.y)
  }
  polygon.vertices.forEach(v => ctx.lineTo(v.x, v.y))
  if (solid) {
    ctx.fill()
  } else {
    ctx.lineTo(polygon.vertices[0].x, polygon.vertices[0].y)
    ctx.stroke()
  }
}
