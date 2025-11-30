require('dotenv').config();
const app = require('./src/app');
const appConfig = require('./src/config/app.config');

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
