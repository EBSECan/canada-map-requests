// This shares and assumes logic with the database setup
// in https://github.com/EBSECan/donatemask. If it changes,
// update this as well.  See the code in:
// https://github.com/EBSECan/donatemask/tree/main/server/db

const { MongoClient } = require("mongodb");

const { extractPostalCode } = require("./postal-code");

const connect = () => {
  return new Promise((resolve, reject) => {
    let dbUri = process.env.ATLAS_URI;
    if (!dbUri) {
      throw new Error("Missing ATLAS_URI environment variable");
    }

    const client = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client.connect(function (err, db) {
      if (err) {
        return reject(err);
      }

      resolve(db.db("donateamask"));
    });
  });
};

module.exports.getPostalCodes = async () => {
  try {
    const db = await connect();
    return db
      .collection("maskrequests")
      .find({})
      .project({
        address: 1,
        postalCode: 1,
      })
      .toArray()
      .then((data) =>
        data
          .map((request) =>
            extractPostalCode(request.postalCode, request.address)
          )
          .filter(Boolean)
      );
  } catch (err) {
    console.warn({ err }, "Unable to get postal code data from MongoDB");
    throw err;
  }
};
