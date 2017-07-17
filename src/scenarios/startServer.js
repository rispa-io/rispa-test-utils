const { runPackageScript } = require('../utils/cli')
const axios = require('axios')

const TIMEOUT = 30000

const webpackBuild = {
  title: 'Start server test',
  task: ({ projectPath }) => {
    const startTime = Date.now()
    const server = runPackageScript(projectPath, 'server', 'start-prod')

    return new Promise((resolve, reject) => {
      let timeout
      const failed = error => {
        reject(error instanceof Error ? error : 'Failed start server')
        clearTimeout(timeout)
      }

      const startTimeout = () => {
        timeout = setTimeout(
          () => axios.get('localhost:3000')
            .then(resolve, () => {
              if (Date.now() - startTime > TIMEOUT) {
                failed('Server did not respond')
              } else {
                startTimeout()
              }
            }),
          100,
        )
      }

      server.then(failed, failed)
    })
  },
}

module.exports = webpackBuild
