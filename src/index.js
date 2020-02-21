const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')

const app = express()

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

app.use(bodyParser.json())

app.use(morgan('dev'))

const port = process.env.PORT || 4000
app.listen(port, () =>
    console.log(chalk.magenta(`server running on port ${port}`))
)
