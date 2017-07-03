const path = require('path')
const fs = require('fs-extra')
const { PLUGIN_PREFIX } = require('@rispa/cli/src/constants')
const { TEST_UTILS_PACKAGE_NAME } = require('../constants')

const readPackageJson = pluginPath => {
  const packageJsonPath = path.resolve(pluginPath, './package.json')
  return fs.readJsonSync(packageJsonPath, { throws: false }) || {}
}

const getDependencies = packageJson => {
  const { dependencies, devDependencies, peerDependencies } = packageJson
  return Object.entries(Object.assign({}, dependencies, devDependencies, peerDependencies))
    .filter(([name]) => name.startsWith(PLUGIN_PREFIX) && name !== TEST_UTILS_PACKAGE_NAME)
    .map(([name]) => name)
}

module.exports = {
  readPackageJson,
  getDependencies,
}
