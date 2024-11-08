require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: '1d'  // Hoặc bạn có thể đặt thời gian hết hạn khác cho JWT
};
