import baseRoutes from './baseRoutes.js'
import eventRoutes from './eventRoutes.js'
// const userRoutes = require('./users');
import cors from 'cors';
const constructorMethod = (app) => {
    app.use(cors());
    app.use('/api/yourpage/events', eventRoutes);
    app.use('/api', baseRoutes);
    app.use('*',(req,res) => {
        res.status(404).json({error: "Not Found!"})
    })
}

export default constructorMethod;