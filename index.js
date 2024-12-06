const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectDB } = require("./database/index.js");
const {errorHandler} = require("./middleware/errorHandler.js");


const app = express();
const PORT = 8082

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,POST', 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(errorHandler);

const userRouter = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes.js");
const { ProductDetails } = require("./database/models/productdetails.js");
const { ProductFeatures } = require("./database/models/productfeatures.js");
const { ProductImage } = require("./database/models/productimage.js");
const { OfferTable } = require("./database/models/offertable.js");

app.get("/", (req, res) => {
  res.send("hello World");
});

app.use("/api/v1/userApi", userRouter);
app.use("/api/v1/productApi", productRoutes);
module.exports = { app };

dotenv.config();

connectDB()
// .then(() => {
//     http.listen(process.env.PORT || 8000, () => {
//     console.log(`Server/ws is running at Port:${process.env.PORT}`);
//     });
// })
// .catch((e) => {
//     console.log("connection failed", e);
// });
const models = {
  ProductFeatures:ProductFeatures,
  ProductImage:ProductImage,
  OfferTable:OfferTable
}

ProductDetails.associate(models);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

