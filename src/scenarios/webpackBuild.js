const { runPackageScript } = require('../utils/cli')

const webpackBuild = {
  title: 'Webpack build test',
  task: ({ projectPath }) => runPackageScript(projectPath, 'webpack', 'build'),
}

module.exports = webpackBuild
