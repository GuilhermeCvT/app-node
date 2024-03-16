require('express-async-errors')
const express = require('express')
const AppError = require('./utils/AppError')
const routes = require('./routes')
const app = express()

app.use(express.json())
const port = 3000

app.use(routes)

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