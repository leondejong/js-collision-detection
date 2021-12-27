// Formatted by StandardJS

// Intersection Tests

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const pointCollision = (a, b) => a.x === b.x && a.y === b.y

const pointSegmentCollision = (a, b) =>
  distance(a, b[0]) + distance(a, b[1]) - distance(b[0], b[1]) < 0.001

const pointBoxCollision = (a, b) =>
  a.x >= b[0].x && a.x <= b[1].x && a.y >= b[0].y && a.y <= b[1].y

const pointRectangleCollision = (a, b) =>
  a.x >= b.x && a.x <= b.x + b.width && a.y >= b.y && a.y <= b.y + b.height

const pointCircleCollision = (a, b) =>
  (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) <= b.r * b.r

const segmentCollision = (a, b) => {
  const ax = a[1].x - a[0].x
  const ay = a[1].y - a[0].y
  const bx = b[1].x - b[0].x
  const by = b[1].y - b[0].y

  const c1 = ax * by - ay * bx

  if (c1 === 0) {
    if (pointSegmentCollision(a[0], b)) return true
    if (pointSegmentCollision(a[1], b)) return true
    if (pointSegmentCollision(b[0], a)) return true
    if (pointSegmentCollision(b[1], a)) return true
    return false
  }

  const cx = a[0].x - b[0].x
  const cy = a[0].y - b[0].y

  const c2 = ax * cy - ay * cx

  if (c2 < 0 === c1 > 0) return false

  const c3 = bx * cy - by * cx

  if (c3 < 0 === c1 > 0) return false

  if (c2 > c1 === c1 > 0 || c3 > c1 === c1 > 0) return false

  return true
}

const segmentCircleCollision = (a, b) => {
  const cx = b.x - a[0].x
  const cy = b.y - a[0].y
  const dx = a[1].x - a[0].x
  const dy = a[1].y - a[0].y

  const s = (cx * dx + cy * dy) / (dx * dx + dy * dy)

  let x = a[0].x + dx * s
  let y = a[0].y + dy * s

  if (s < 0) {
    x = a[0].x
    y = a[0].y
  } else if (s > 1) {
    x = a[1].x
    y = a[1].y
  }

  return (b.x - x) * (b.x - x) + (b.y - y) * (b.y - y) <= b.radius * b.radius
}

const segmentRectangleCollision = (a, b) => {
  const x1 = b.x
  const y1 = b.y
  const x2 = b.x + b.width
  const y2 = b.y + b.height

  let p1 = { x: x1, y: y1 }
  let p2 = { x: x2, y: y1 }
  if (segmentCollision(a, [p1, p2])) return true

  p1 = { x: x2, y: y1 }
  p2 = { x: x2, y: y2 }
  if (segmentCollision(a, [p1, p2])) return true

  p1 = { x: x2, y: y2 }
  p2 = { x: x1, y: y2 }
  if (segmentCollision(a, [p1, p2])) return true

  p1 = { x: x1, y: y2 }
  p2 = { x: x1, y: y1 }
  if (segmentCollision(a, [p1, p2])) return true

  if (pointRectangleCollision(a[0], b)) return true
  if (pointRectangleCollision(a[1], b)) return true

  return false
}

const segmentBoxCollision = (a, b) => {
  const r = {
    x: b[0].x,
    y: b[0].y,
    width: b[1].x - b[0].x,
    height: b[1].y - b[0].y
  }
  return segmentRectangleCollision(a, r)
}

const circleRectangleCollision = (a, b) => {
  const dx = a.x - Math.max(b.x, Math.min(a.x, b.x + b.width))
  const dy = a.y - Math.max(b.y, Math.min(a.y, b.y + b.height))
  return dx * dx + dy * dy <= a.radius * a.radius
}

const circleBoxCollision = (a, b) => {
  const dx = a.x - Math.max(b[0].x, Math.min(a.x, b[0].x + b[1].x - b[0].x))
  const dy = a.y - Math.max(b[0].y, Math.min(a.y, b[0].y + b[1].y - b[0].y))
  return dx * dx + dy * dy <= a.radius * a.radius
}

const circleCollision = (a, b) => {
  const dx = a.x + a.radius - (b.x + b.radius)
  const dy = a.y + a.radius - (b.y + b.radius)
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= a.radius + b.radius
}

const boxCollision = (a, b) =>
  a[0].x <= b[0].x + b[1].x - b[0].x &&
  b[0].x <= a[0].x + a[1].x - a[0].x &&
  a[0].y <= b[0].y + b[1].y - b[0].y &&
  b[0].y <= a[0].y + a[1].y - a[0].y

const rectangleCollision = (a, b) =>
  a.x <= b.x + b.width &&
  b.x <= a.x + a.width &&
  a.y <= b.y + b.height &&
  b.y <= a.y + a.height
