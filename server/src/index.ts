import { createServer } from './server'

const port = process.env.PORT || 4000

createServer()
  .then(server => {
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
    })
  })
  .catch(err => console.error(err))
  