const { runPackageScript } = require('../utils/cli')

const storybookBuild = {
  title: 'Storybook build test',
  task: ({ projectPath }) => runPackageScript(projectPath, 'ui', 'build-storybook'),
}

module.exports = storybookBuild
