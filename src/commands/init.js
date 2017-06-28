const path = require('path')
const fs = require('fs-extra')
const Command = require('@rispa/cli/src/Command')
const { createProject } = require('../utils/cli')
const { scanDependencies } = require('../utils/plugin')
const { PROJECT_NAME } = require('../constants')

class InitCommand extends Command {
  init() {
    this.add([
      {
        title: 'Scan plugin',
        task: ctx => {
          ctx.dependencies = scanDependencies(ctx.cwd)
        },
      },
      {
        title: 'Create project',
        task: ctx => {
          const { cwd } = ctx
          ctx.projectPath = path.resolve(cwd, `./${PROJECT_NAME}`)

          fs.removeSync(ctx.projectPath)

          return createProject(cwd, PROJECT_NAME, ctx.dependencies)
        },
      },
    ])
  }
}

InitCommand.commandName = 'init'
InitCommand.commandDescription = 'Init structure'

module.exports = InitCommand
