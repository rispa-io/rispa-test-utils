const { runCommand } = require('@rispa/cli')
const { ALL_PLUGINS } = require('@rispa/cli/src/constants')

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

const migrateProject = projectPath => runCommand(
  'migrate',
  [],
  {
    cwd: projectPath,
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

const updatePlugins = projectPath => runCommand(
  'update',
  [ALL_PLUGINS],
  {
    cwd: projectPath,
  },
  options,
)

module.exports = {
  createProject,
  runPackageScript,
  addPlugins,
  updatePlugins,
  migrateProject,
}
