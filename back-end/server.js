const app = require("./app.js");
const { PORT = 3001 } = process.env;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
