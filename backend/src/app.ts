import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dbConfig from "./config/dbConn";
import users from "./routes/users";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", users);

mongoose
  .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));