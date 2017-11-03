const path = require('path')
const fs = require('fs-extra')
const Command = require('@rispa/cli/src/Command')
const { CONFIGURATION_PATH, ALL_PLUGINS } = require('@rispa/cli/src/constants')
const { createProject, addPlugins, updatePlugins, runPackageScript, migrateProject } = require('../utils/cli')
const { readPackageJson, getDependencies } = require('../utils/plugin')
const { PROJECT_NAME, PLUGIN_TARGET_PATH } = require('../constants')

class InitCommand extends Command {
  constructor([...args], options) {
    super(options)
  }

  init() {
    this.add([
      {
        title: 'Init',
        task: ctx => {
          const packageJson = readPackageJson(ctx.cwd)
          ctx.name = packageJson.name
          ctx.dependencies = getDependencies(packageJson)
          ctx.runPath = path.resolve(ctx.cwd, '..')
          ctx.projectPath = path.resolve(ctx.runPath, `./${PROJECT_NAME}`)
          ctx.cache = fs.existsSync(path.resolve(ctx.projectPath, CONFIGURATION_PATH))
        },
      },
      {
        title: 'Create project',
        skip: ({ cache }) => cache && 'Cache',
        task: ({ runPath, projectPath }) => {
          fs.removeSync(projectPath)

          return createProject(runPath, PROJECT_NAME)
        },
      },
      {
        title: 'Migrate project',
        skip: ({ cache }) => !cache && 'New project fit latest config',
        task: ({ projectPath }) => {
          return migrateProject(projectPath)
        },
      },
      {
        title: 'Add dependencies',
        task: ctx => {
          const pluginTarget = path.resolve(ctx.projectPath, PLUGIN_TARGET_PATH)

          fs.ensureDirSync(pluginTarget)

          const exludeDirs = ['/node_modules/']
          fs.copySync(ctx.cwd, pluginTarget, {
            filter: src => {
              const relSrc = path.relative(ctx.cwd, src)
              return !exludeDirs.some(dir => relSrc.indexOf(dir) !== -1)
            },
          })

          if (ctx.cache) {
            return updatePlugins(ctx.projectPath)
          }
          return addPlugins(ctx.projectPath, ctx.dependencies)
        },
      },
      {
        title: 'Build plugins',
        task: ({ projectPath }) => {
          return runPackageScript(projectPath, ALL_PLUGINS, 'compile', [])
        },
      },
    ])
  }
}

InitCommand.commandName = 'init'
InitCommand.commandDescription = 'Init structure'

module.exports = InitCommand
