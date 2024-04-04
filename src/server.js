require('express-async-errors')
require('dotenv/config')

const express = require('express')
const uploadConfig = require('./configs/upload')
const AppError = require('./utils/AppError')
const routes = require('./routes')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3001

app.use(routes)
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(
  (error, request, response, next) => {
    if(error instanceof AppError){
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message
      })
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
)

app.listen(port, () => console.log(`Server is running on port ${port}`))