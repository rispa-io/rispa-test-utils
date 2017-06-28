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
          ctx.projectPath = path.resolve(cwd, `./${PROJECT_NAME}`)

          fs.removeSync(ctx.projectPath)

          return createProject(cwd, PROJECT_NAME, ['@rispa/core'])
        },
      },
      {
        title: 'Add dependencies',
        task: ctx => {
          const pluginTarget = path.resolve(ctx.projectPath, PLUGIN_TARGET_PATH)

          fs.ensureDirSync(pluginTarget)
          const exludeDirs = ['/build/', '/node_modules/']
          fs.copySync(ctx.cwd, pluginTarget, {
            filter: src => !exludeDirs.some(dir => src.indexOf(dir) !== -1),
          })

          // fs.ensureSymlinkSync(ctx.cwd, pluginTarget, 'dir')

          return addPlugins(ctx.projectPath, ctx.dependencies)
        },
      },
    ])
  }
}

InitCommand.commandName = 'init'
InitCommand.commandDescription = 'Init structure'

module.exports = InitCommand
