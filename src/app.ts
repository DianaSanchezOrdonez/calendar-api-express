import { app } from './server'

const port = process.env.PORT ? +process.env.PORT : 3000

const server = app.listen(port, () => {
  console.log(`⚡️[server]: server is running on port ${port}`)
})

export { server }
