import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import {rateLimit} from 'express-rate-limit'
import {createServer} from 'http';
import requestIp from 'request-ip';
import { ApiError } from "./utils/ApiError.js";
import morganMiddleware from "./logger/morgan.logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import dotenv from "dotenv";


dotenv.config();   

const app = express();

const httpServer = createServer(app);

app.use(express.json({ limit: "16kb" }));
app.use(
    cors({
        origin: `${process.env.CORS_ORIGIN}`,
        credentials: true,
    })
);

app.use(helmet());
app.use(requestIp.mw())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator:(req)=> {
        return req.clientIp;
    },
    handler:(_, __, ___,options) =>{
        throw new ApiError(
            options.statusCode || 500,
            `There are too many requests. You are only allowed ${
                options.max
            } requests per ${options.windowMs / 60000} minutes`
        );
    },
});

app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morganMiddleware)

app.get("/", (req, res) => {
    res.send("Welcome to our ecommerce API");
});

app.use(errorHandler);
export { httpServer };
