console.log(
  [...Array(30)].map((e) => ((Math.random() * 36) | 0).toString(36)).join("")
);

// import config from "config";

// const dbConfig = config.get("db");
// const dbJwt = config.get("jwt");
// console.log(dbConfig.userName, dbConfig.password, dbJwt.secretKey);

// //or this way
// console.log(config.get("db.userName"));
// console.log(config.get("db.password"));
// console.log(config.get("jwt.secretKey"));
