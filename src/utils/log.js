const handleError = e => {
  console.error(e)
  if (e.errors) {
    e.errors.forEach(error => console.error(error))
  }
  if (e.context) {
    console.error('Context:')
    console.error(e.context)
  }
  process.exit(1)
}

module.exports = {
  handleError,
}
