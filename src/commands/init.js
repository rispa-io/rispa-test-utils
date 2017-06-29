const path = require('path')
const fs = require('fs-extra')
const Command = require('@rispa/cli/src/Command')
const { createProject, addPlugins } = require('../utils/cli')
const { readPackageJson, getDependencies } = require('../utils/plugin')
const { PROJECT_NAME, PLUGIN_TARGET_PATH } = require('../constants')

class InitCommand extends Command {
  constructor([...args], options) {
    super(options)
  }

  init() {
    this.add([
      {
        title: 'Scan plugin',
        task: ctx => {
          const packageJson = readPackageJson(ctx.cwd)
          ctx.name = packageJson.name
          ctx.dependencies = getDependencies(packageJson)
        },
      },
      {
        title: 'Create project',
        task: ctx => {
          const { cwd } = ctx
          const runPath = path.resolve(cwd, '..')

          ctx.projectPath = path.resolve(runPath, `./${PROJECT_NAME}`)
          fs.removeSync(ctx.projectPath)

          return createProject(runPath, PROJECT_NAME)
        },
      },
      {
        title: 'Add dependencies',
        task: ctx => {
          const pluginTarget = path.resolve(ctx.projectPath, PLUGIN_TARGET_PATH)

          fs.ensureDirSync(pluginTarget)
          const exludeDirs = ['/build/', '/node_modules/']
          fs.copySync(ctx.cwd, pluginTarget, {
            filter: src => {
              const relSrc = path.relative(ctx.cwd, src)
              return !exludeDirs.some(dir => relSrc.indexOf(dir) !== -1)
            },
          })

          return addPlugins(ctx.projectPath, ctx.dependencies)
        },
      },
    ])
  }
}

InitCommand.commandName = 'init'
InitCommand.commandDescription = 'Init structure'

module.exports = InitCommand
