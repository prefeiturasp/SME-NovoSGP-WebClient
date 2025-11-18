// cypress/plugin/index.js

require('dotenv').config()
const cucumber = require('cypress-cucumber-preprocessor').default
const postgreSQL = require('cypress-postgresql')
const pg = require('pg')

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
}

module.exports = (on, config) => {
  on('file:preprocessor', cucumber())

  const pool = new pg.Pool(dbConfig)
  const tasks = postgreSQL.loadDBPlugin(pool)
  on('task', tasks)

  return config
}
