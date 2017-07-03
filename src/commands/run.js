const path = require('path')
const Command = require('@rispa/cli/src/Command')
const { runPackageScript } = require('../utils/cli')
const { PROJECT_NAME } = require('../constants')

class RunCommand extends Command {
  constructor([pluginName, scriptName, ...args], options) {
    super(Object.assign({
      renderer: 'silent',
    }, options))

    this.state = {
      pluginName,
      scriptName,
      args,
    }
  }

  init() {
    this.add([
      {
        title: 'Run package script',
        task: ({ cwd }) => {
          const { pluginName, scriptName, args } = this.state
          const projectPath = path.resolve(cwd, `../${PROJECT_NAME}`)

          return runPackageScript(projectPath, pluginName, scriptName, args)
        },
      },
    ])
  }
}

RunCommand.commandName = 'run'
RunCommand.commandDescription = 'Run package script'

module.exports = RunCommand
