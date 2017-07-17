const Listr = require('listr')
const path = require('path')
const Command = require('@rispa/cli/src/Command')
const { PROJECT_NAME } = require('../constants')
const webpackBuild = require('../scenarios/webpackBuild')
const storybookBuild = require('../scenarios/storybookBuild')

const scenarios = {
  'webpack-build': webpackBuild,
  'storybook-build': storybookBuild,
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
          const scenarioList = scenarioNames.map(name => scenarios[name])

          const invalidScenarioList = scenarioList.filter(scenario => !scenario)
          if (invalidScenarioList.length > 0) {
            throw new Error(`Can't find scenarios: ${invalidScenarioList.join(', ')}`)
          }

          return new Listr(scenarioList)
        },
      },
    ])
  }
}

AcceptanceCommand.commandName = 'acceptance'
AcceptanceCommand.commandDescription = 'Run acceptance scenario'

module.exports = AcceptanceCommand
