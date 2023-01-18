import  express  from "express";
import  handlebars  from "express-handlebars";
import  {engine}  from "express-handlebars";
import logger from "./log/logger.js";
import os from "os"
import { infoRoute } from "./routes/info.js";
import cluster from "cluster";
import { randomRoute } from "./routes/random.js";
import { randomCompress } from "./routes/randomCompress.js";
import { infoCompress } from "./routes/infoCompress.js";

const cpuNum = os.cpus().length
const app = express()

app.use(express.json)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public"));
app.engine(`handlebars`, engine())
app.set('view engine', 'handlebars');
app.set('views', '../public/views');

app.use("/info", infoRoute )
app.use("/random", randomRoute)
app.use("/info", infoCompress )
app.use("/random", randomCompress)

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, ()=>{
    if(cluster.isPrimary){
        for (let index = 0; index < cpuNum; index++) {
            cluster.fork()
        }
        cluster.on(`exit`, (w)=>{
            logger.info(`Server`, {message: `worker exit ${w.process.pid}`})
        })

    }else{
        logger.info(`server`, {message:`Worker on ${process.pid} on!`})
    }
})

server.on(`error`, (error)=> logger.error(`server`, {message:`An error has ocurred ${error}`}))
