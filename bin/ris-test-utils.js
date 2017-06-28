#!/usr/bin/env node

const { handleError } = require('../src/utils/log')

const InitCommand = require('../src/commands/init')
const RunCommand = require('../src/commands/run')

const commands = [
  InitCommand,
  RunCommand,
]

const runCommand = ([commandName, ...args]) => {
  const Command = commands.find(command => command.commandName === commandName)
  if (!Command) {
    console.log('Can\'t find command')
    process.exit(1)
  }

  const command = new Command(args, { renderer: 'verbose' })
  command.init()
  command.run({
    cwd: process.cwd(),
  }).catch(handleError)
}

const args = process.argv.slice(2)
runCommand(args)
