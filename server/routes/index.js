const baseRoutes=require('./baseRoutes')

const constructorMethod = (app) => {
    app.use('/',baseRoutes)
    app.use('*',(req,res) => {
        res.status(404).json({error: "Not Found!"})
    })
}

module.exports=constructorMethod;