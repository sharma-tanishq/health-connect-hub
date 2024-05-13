const fs = require('fs');
const path = require('path');

module.exports = {
  server: {
    ssl: {
      cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
      key: fs.readFileSync(path.join(__dirname, 'server.key'))
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
}