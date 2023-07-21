const express = require("express");
const { dbConnection } = require("./config/config");
const app = express();
const cors = require("cors")
const { handleTypeError }= require('./middleware/errors');
require("dotenv").config();
const PORT = process.env.PORT || 3001;


dbConnection();

app.use(express.json());
app.use(cors())
app.use("/users", require("./routes/users"));

app.use("/queries", require("./routes/queries"));

app.use("/answers", require("./routes/answers"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));

module.exports = app;
