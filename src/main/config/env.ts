export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/auth-api",
  port: process.env.PORT || 8000,
};
