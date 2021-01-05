module.exports = {
  apps: [
    {
      name: 'GitWrapped',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: '/root/GitWrapped/node_modules/@nuxt/typescript-runtime/bin/nuxt-ts.js',
      args: 'start'
    }
  ]
}
