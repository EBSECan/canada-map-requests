const fs = require("fs/promises");

const { getPostalCodes } = require("./db");
const { getPostalCodeGeo } = require("./postal-code.js");

// Get the (lat, lng) coords for the given postalCode
const run = async () => {
  try {
    const postalCodes = await getPostalCodes();
    const mapData = postalCodes.map(getPostalCodeGeo).filter(Boolean);

    await fs.writeFile("./requests-geo.json", JSON.stringify(mapData));
    console.log(
      `Found ${mapData.length} postal codes and wrote them to ./requests-geo.json`
    );
    process.exit(0);
  } catch (err) {
    console.warn({ err }, "Unable to parse requests into geo locations");
    process.exit(1);
  }
};

run();
