const express = require("express");
const app = express();

app.get("/", (req, res) => {
  return res.status(200).end("hello");
});

app.get("/get-menus", async (req, res) => {
  const url = req.query.url;
  console.log("🚀 ~ file: server.js:6 ~ app.get ~ url:", url);
  const crawl = require("./crawl.js");
  let menus = [];
  try {
    if (url.includes("grab")) {
      menus = await crawl.getDataGrab(url);
    } else if (url.includes("shopeefood")) {
      menus = await crawl.getDataShopeeFood(url);
    }
  } catch (error) {
    console.log(error);
  }

  return res
    .status(200)
    .set({ "content-type": "application/json; charset=utf-8" })
    .end(JSON.stringify(menus));
});

const server = app.listen(8081, function () {
  const port = server.address().port;
  console.log("Example app listening at http://127.0.0.1:%s", port);
});
