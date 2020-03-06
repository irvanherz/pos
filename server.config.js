module.exports = {
  apps: [
    {
      name: 'POS App',
      script: './index.js',
      instances: 0,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: '3001'
      }
    }
  ]
};