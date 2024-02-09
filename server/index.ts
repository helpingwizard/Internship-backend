import express from 'express';
import cors from 'cors';
import userRouter from "./routes/userRoutes";
import adminRouter from "./routes/adminRoutes";
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
