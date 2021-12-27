// Formatted by StandardJS

// Broad and Narrow Phase

const updateCollisions = (collisions, collision, shape) => {
  const c = collisions[shape.id]
  let { overlap, mtv } = collision
  if (c) {
    overlap = overlap || c.overlap
    mtv = { x: mtv.x + c.mtv.x, y: mtv.y + c.mtv.y }
  }
  return {
    ...collisions,
    [shape.id]: { shape, overlap, mtv }
  }
}

const broadPhase = shapes => {
  const collisions = []
  const pairs = getPairs(shapes)
  pairs.forEach(s => {
    if (s[0].type === polygon && s[1].type === polygon) {
      if (boxCollision(s[0].box, s[1].box)) collisions.push(s)
    } else if (s[0].type === polygon) {
      if (circleBoxCollision(s[1], s[0].box)) collisions.push(s)
    } else if (s[1].type === polygon) {
      if (circleBoxCollision(s[0], s[1].box)) collisions.push(s)
    } else {
      if (circleCollision(s[0], s[1])) collisions.push(s)
    }
  })
  return collisions
}

const narrowPhase = pairs => {
  let cs = {}
  pairs.forEach(s => {
    let collision
    if (s[0].type === polygon && s[1].type === polygon) {
      collision = polygonToPolygon(s[0], s[1])
    } else if (s[0].type === polygon) {
      collision = polygonToCircle(s[0], s[1])
    } else if (s[1].type === polygon) {
      collision = circleToPolygon(s[0], s[1])
    } else {
      collision = circleToCircle(s[0], s[1])
    }
    if (collision) {
      let { mtv } = collision
      mtv = { x: -mtv.x, y: -mtv.y }
      cs = updateCollisions(cs, collision, s[0])
      cs = updateCollisions(cs, { ...collision, mtv }, s[1])
    }
  })
  return cs
}
