import dotenv from 'dotenv'
dotenv.config({path:path.resolve("./config/.env")})
import express from 'express'
import path from 'path'
import { bootstrap } from './src/app.controller.js'
const app = express()
const port = process.env.PORT
bootstrap(app,express)
app.listen(port, () => console.log(`Saraha app listening on port ${port}!`))