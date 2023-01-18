import os from "os"
import { Router } from "express";
import logger from "../log/logger.js";


const router = Router()


router.get(`/`, (req , res)=>{
    try {
        const cpu = os.cpus().length
        const random = () => {Math.random() * (10 - 1) + 1}
        res.send(cpu * random)
    } catch (error) {
        logger.error(`server`, {message:`Information error ${error}`})
    }
})


export {router as randomRoute }