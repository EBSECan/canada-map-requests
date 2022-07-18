const postalCodeHelpers = require('postal-code-helpers');
const postalGeo = require("./postal-geo.json");

// We may or may not have a postalCode. Try to format it properly.
const cleanPostalCode = (postalCode) => {
  if(!postalCode) {
    return null;
  }

  let cleaned = postalCode.trim().toUpperCase().replace(/ /g, "");
  // If it's not 6 in length now, it's likely not parsable, give up.
  if (cleaned.length !== 6) {
    return null;
  }

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
}

// If we have a postalCode, use that.  Otherwise try to
// extract it from the address
module.exports.extractPostalCode = (postalCode, address) => {
  if(postalCode) {
    return cleanPostalCode(postalCode);
  }

  const extracted = postalCodeHelpers.extract(address, 'CA');
  if(!(extracted && extracted.length)) {
    return null;
  }
  return cleanPostalCode(extracted[0]);
}

// Get the (lat, lng) coords for the given postalCode
module.exports.getPostalCodeGeo = (postalCode) => {
  if(!postalCode) {
    return null;
  }

  const geo = postalGeo[postalCode];
  if (!geo) {
    return null;
  }

  return {
    postalCode,
    lat: geo.lat,
    lng: geo.lng,
  };
};
