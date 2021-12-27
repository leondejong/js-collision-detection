// Formatted by StandardJS

// General Functions

const random = (min, max) => Math.random() * (max - min) + min

const randomString = (length = 12) =>
  length < 9
    ? Math.random()
        .toString(36)
        .substr(2, length)
    : randomString(8) + randomString(length - 8)

// Fisher, Yates, Durstenfeld, Knuth
const shuffle = list => {
  const l = list.slice(0)
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[l[i], l[j]] = [l[j], l[i]]
  }
  return l
}

const getPairs = l => l.flatMap((a, n) => l.slice(n + 1).map(b => [a, b]))
