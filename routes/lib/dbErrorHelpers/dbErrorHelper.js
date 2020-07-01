"use strict";

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
  let output;

  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );

    let whereToSlice = fieldName.lastIndexOf(":") + 2;

    output = fieldName.slice(whereToSlice) + " already exists";

    /*
    let fieldName = errorMessage.match(/"/).index;

    let newStr = errorMessage.slice(fieldName + 1, errorMessage.length - 3);

    output = newStr + " already exist please user another one!";
    */
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
  let message = "";
  console.log(err.message);
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else if (err.message) {
    return err.message;
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

module.exports = getErrorMessage;
