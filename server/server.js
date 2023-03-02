import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'

import connect from './db/connect.js'
import router from './router/route.js';

const app = express();

/* Middlewares */
dotenv.config();
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.status(201).json("Home get request")
})

/* api routes */
app.use('/api', router)

/* start server if and after a valid DB connection */
connect().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (error) {
        console.log("Cannot connect to the server")
    }
}).catch(error => console.log("Invalid DB Connection"))

