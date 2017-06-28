const path = require('path')
const fs = require('fs-extra')
const { PLUGIN_PREFIX } = require('@rispa/cli/src/constants')

const readPackageJson = pluginPath => {
  const packageJsonPath = path.resolve(pluginPath, './package.json')
  return fs.readJsonSync(packageJsonPath, { throws: false }) || {}
}

const scanDependencies = pluginPath => {
  const { dependencies, devDependencies, peerDependencies, name: packageName } = readPackageJson(pluginPath)
  return Object.entries(Object.assign({}, dependencies, devDependencies, peerDependencies))
    .filter(([name]) => name.startsWith(PLUGIN_PREFIX))
    .map(([name]) => name).concat(packageName)
}

module.exports = {
  readPackageJson,
  scanDependencies,
}
