const userModel = require("../models/userModel");

const isValidString = function (data) {
  if (typeof data != "string" || data.trim().length === 0) {
    return false;
  }
  return true;
};
const isNumberInString = function (data) {
  const isNumberInStringRegex = /^[a-zA-Z ]*$/;

  return isNumberInStringRegex.test(data);
};

const isEmailValid = function (data) {
  const isEmailValidRegex = /^([a-z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/;
  return isEmailValidRegex.test(data);
};
const isPhoneNoValid = function (data) {
  const iisPhoneNoValidRegex = /^((\+91)?|91)?[789][0-9]{9}$/;

  return iisPhoneNoValidRegex.test(data);
};

const isPasswordValidLength = function (data) {
  const isPasswordValidLengthRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;

  return isPasswordValidLengthRegex.test(data);
};

const createUser = async function (req, res) {
  try {
    // asigning the keys in the request body
    let { title, name, password, email, address, phone } = req.body;
  //validation for title 
    if (title != ("Mr" || "Mrs" || "Miss")) {
      return res.status(400).send({ status: false, msg: "title is invalid" });
    }
  //if the key is not present in the request body
    let requiredFields = ["title", "name", "password", "email", "phone"];
    for (field of requiredFields) {
      if (!req.body.hasOwnProperty(field)) {
        return res
          .status(400)
          .send({ status: false, msg: `this key is not present==>${field}` });
      }
      //if the key value is not in the string format
      if (!isValidString(req.body[field])) {
        return res
          .status(400)
          .send({ status: false, msg: `${field} is invalid` });
      }
    }
//key value validation 
    let letters = ["title", "name"];
    for (field of letters) {
      if (!isNumberInString(req.body[field])) {
        return res.status(400).send({
          status: false,
          msg: `can't use number in string==>${field}`,
        });
      }
    }
   //validation for email
    if (!isEmailValid(email.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "email is not in proper" });
    }
    //validation for phone No.
    if (!isPhoneNoValid(phone.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "phone number is invalid" });
    }
    //if the key is already present in the db
    let data = req.body;
    let unique = ["email", "phone"];
    for (field of unique) {
      let obj = {};
      obj[field] = data[field];
      let verify = await userModel.findOne(obj);
      if (verify)
        return res
          .status(404)
          .send({ status: false, msg: `${field}  is already taken` });
    }
    // Password validation
    if (!isPasswordValidLength(password.trim())) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
        });
    }
    const savedData = await userModel.create(req.body);
    return res.status(201).send({ status: false, data: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports = { createUser };
