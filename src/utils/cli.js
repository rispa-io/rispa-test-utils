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

const runPackageScript = (projectPath, pluginName, scriptName, args) => runCommand(
  'run',
  [pluginName, scriptName, ...args],
  {
    cwd: projectPath,
  },
  options,
)

module.exports = {
  createProject,
  runPackageScript,
}
