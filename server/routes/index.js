import baseRoutes from './baseRoutes.js'
import eventRoutes from './eventRoutes.js'
import cors from 'cors'
// const userRoutes = require('./users');
const constructorMethod = (app) => {
    app.use(cors())
    app.use('/api/yourpage/events', eventRoutes);
    app.use('/api', baseRoutes);
    app.use('*',(req,res) => {
        res.status(404).json({error: "Not Found!"})
    })
}

export default constructorMethod;