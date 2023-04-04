const express=require('express');
const app=express();
const session=require('express-session')
const configRoutes=require('./routes')
const connection=require('./config/mongoConnection')
const validation=require('./validation')

configRoutes(app)

const main=async() => {
    const db = await connection.dbConnection();
}

app.listen(3001, () => {
    console.log("Your routes are running on http://localhost:3001")
})