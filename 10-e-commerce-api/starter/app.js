require("dotenv").config();
require("express-async-errors");
const fileUpload = require("express-fileupload");
const express = require("express");
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
//security packages:

const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
// const cloudinary = require('cloudinary').v2;
//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//other middleware
const morgan = require("morgan");

//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRouters = require("./routes/orderRouters");

//cloudinary configuration

// cloudinary.config({
//     cloud_name: 'matteocloudimages',
//     api_key: '998984457198582',
//     api_secret: 'k4Yvt4p9OUBL2H_qulwuhwjDZLY'
//   });



//express
const app = express();
//safety
app.set('trust proxy',1)
app.use(rateLimiter(
   {windowMs:15*60*1000,max:100}
))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())


const port = process.env.PORT || 5001;
app.use(
  fileUpload({
    // useTempFiles : true,
    // tempFileDir : './tmp/',
    debug: true,
  })
);



app.use(cors());
app.use(express.static("./public"));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.cookie("cookie1", "nome del cookie e il suo valore");
  res.send("hello from the server!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRouters);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//run the server

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log("listening on port: ", port));
  } catch (err) {
    process.exit(1);
  }
};
start();
