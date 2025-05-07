
import dbconnection from "./config/db.js";
import serverSetup from "./server.js";
import dotenv from "dotenv";
dotenv.config();

console.log("process .env .port",process.env.PORT);
dbconnection()
  .then(() => {
    serverSetup().listen(4000, () =>
      console.log(`Server started at PORT 4000`)
    );
  })
  .catch((err) => console.log(err.message));
