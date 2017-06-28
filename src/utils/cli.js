const { runCommand } = require('@rispa/cli')

const options = {
  renderer: 'verbose',
}

const createProject = (path, projectName) => runCommand(
  'new',
  [projectName],
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

const addPlugins = (projectPath, pluginNames) => runCommand(
  'add',
  pluginNames,
  {
    cwd: projectPath,
  },
  options,
)

module.exports = {
  createProject,
  runPackageScript,
  addPlugins,
}
