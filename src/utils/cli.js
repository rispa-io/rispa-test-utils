const { runCommand } = require('@rispa/cli')

const options = {
  renderer: 'verbose',
}

const createProject = (path, projectName, plugins) => runCommand(
  'new',
  [projectName, ''].concat(plugins),
  {
    cwd: path,
    mode: 'test',
  },
  options
)

module.exports = {
  createProject,
}
