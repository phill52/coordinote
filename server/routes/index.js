const baseRoutes=require('./baseRoutes')
const eventRoutes=require('./eventRoutes')

const constructorMethod = (app) => {
    app.use('/api/yourpage/events',eventRoutes)
    app.use('/api',baseRoutes)
    // app.use('*',(req,res) => {
    //     res.status(404).json({error: "Not Found!"})
    // })
}

module.exports=constructorMethod;