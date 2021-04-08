const PORT = 8080;
const app = require("./express");

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`listening to port ${PORT}`);
});
