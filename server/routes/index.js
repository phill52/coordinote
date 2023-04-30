import baseRoutes from './baseRoutes.js'
import eventRoutes from './eventRoutes.js'
// const userRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/api/yourpage/events', eventRoutes);
    app.use('/api', baseRoutes);
    app.use('*',(req,res) => {
        res.status(404).json({error: "Not Found!"})
    })
}

export default constructorMethod;