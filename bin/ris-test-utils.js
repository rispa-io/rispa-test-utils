#!/usr/bin/env node

const createDebug = require('debug')

const InitCommand = require('../src/commands/init')
const RunCommand = require('../src/commands/run')

const commands = [
  InitCommand,
  RunCommand,
]

const logError = createDebug('rispa:error:test-utils')

const handleError = e => {
  logError(e)
  if (e.errors) {
    e.errors.forEach(error => logError(error))
  }
  if (e.context) {
    logError('Context:')
    logError(e.context)
  }
  process.exit(1)
}

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
