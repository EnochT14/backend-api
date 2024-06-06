import express, { Express, Router, Request, Response } from "express";
import phonesRouter from "./controllers/phones";
import dotenv from "dotenv";
import cors from "cors";
import decodeIDToken from "./authenticateToken";
import connectMongoDB from "./mongodb/connectMongoDB";
import usersRouter from "./controllers/users";
import rateLimitMiddleware from "./dist/middlewares/rateLimiter";
import candlesRoutes from './stock/candles';
import searchRoutes from './stock/search';

dotenv.config();

connectMongoDB();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(decodeIDToken);

app.use('/api', rateLimitMiddleware);
app.use("/api/phones", phonesRouter);
app.use("/api/phones/:uid", phonesRouter);
app.use("/api/users", usersRouter);
app.use("/api/users/:uid", usersRouter);

//stock routes
app.use('/api/stock', searchRoutes);
app.use('/api/stock', candlesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Verge Money - Backend API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
