const Listr = require('listr')
const path = require('path')
const Command = require('@rispa/cli/src/Command')
const { PROJECT_NAME } = require('../constants')
const webpackBuild = require('../scenarios/webpackBuild')
const storybookBuild = require('../scenarios/storybookBuild')
const startServer = require('../scenarios/startServer')

const scenarios = {
  'webpack-build': webpackBuild,
  'storybook-build': storybookBuild,
  'start-server': startServer,
}

class AcceptanceCommand extends Command {
  constructor([...scenarioNames], options) {
    super(options)

    this.state = {
      scenarioNames,
    }
  }

  init() {
    const { scenarioNames } = this.state

    this.add([
      {
        title: 'Init',
        task: ctx => {
          const { cwd } = ctx

          ctx.projectPath = path.resolve(cwd, `../${PROJECT_NAME}`)
        },
      },
      {
        title: 'Run scenarios',
        skip: () => !process.env.CI_ACCEPTANCE && 'Acceptance tests disabled',
        task: () => {
          const scenarioList = scenarioNames.map(name => ({ name, task: scenarios[name] }))

          const invalidScenarioList = scenarioList
            .filter(scenario => !scenario.task)
            .map(scenario => scenario.name)

          if (invalidScenarioList.length > 0) {
            throw new Error(`Can't find scenarios: ${invalidScenarioList.join(', ')}`)
          }

          return new Listr(scenarioList.map(scenario => scenario.task))
        },
      },
    ])
  }
}

AcceptanceCommand.commandName = 'acceptance'
AcceptanceCommand.commandDescription = 'Run acceptance scenario'

module.exports = AcceptanceCommand
