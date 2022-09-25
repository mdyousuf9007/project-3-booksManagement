const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//.............validation for String..........................
const isValidString = function (data) {
  if (typeof data != "string" || data.trim().length === 0) {
    return false;
  }
  return true;
};
//..............validation for number in String using Regex...............
const isNumberInString = function (data) {
  const isNumberInStringRegex = /^[a-zA-Z ]*$/;

  return isNumberInStringRegex.test(data);
};
//..............validation for Email using Regex..........................
const isEmailValid = function (data) {
  const isEmailValidRegex = /^([a-z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/;
  return isEmailValidRegex.test(data);
};
//..............validation of PhoneNumber using Regex.....................
const isPhoneNoValid = function (data) {
  const iisPhoneNoValidRegex = /^((\+91)?|91)?[789][0-9]{9}$/;

  return iisPhoneNoValidRegex.test(data);
};

//.............validation of password length using Regex..................
const isPasswordValidLength = function (data) {
  const isPasswordValidLengthRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;

  return isPasswordValidLengthRegex.test(data);
};

//...........................post api createUser......................................
const createUser = async function (req, res) {
  try {
    let { title, name, password, email, address, phone } = req.body;

    if(Object.keys(req.body).length===0){
      return res.status(400).send({status:false,msg:"request body is empty"})
    }

    //if the key is not present in the request body
    let requiredFields = ["title", "name", "password", "email", "phone"];
    for (field of requiredFields) {
      if (!req.body.hasOwnProperty(field)) {
        return res
          .status(400)
          .send({ status: false, msg: `this ==>${field}<==key is not present` });
      }
     // if the key value is not in the string format
      if (!isValidString(req.body[field])) {
        return res
          .status(400)
          .send({ status: false, msg: `${field} is invalid` });
      }
    }
    //key value validation can't use number in String
    let letters = ["title", "name"];
    for (field of letters) {
      if (!isNumberInString(req.body[field])) {
        return res.status(400).send({
          status: false,
          msg: `can't use number in string==>${field}`,
        });
      }
    }
    //validation for email checking if the email format is correct or not
    if (!isEmailValid(email.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "email is not in a proper format" });
    }
    //validation for phone Number
    if (!isPhoneNoValid(phone.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "phone number is invalid" });
    }
    //if the key is already present in the collecton
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
      return res.status(400).send({
        status: false,
        msg: "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      });
    }
    // validation for title
   if (!["Mr", "Mrs", "Miss"].includes(title)) {
    return res
      .status(400)
      .send({ status: false, msg: `this title is invalid ==>${title}` });
  }
    const savedData = await userModel.create(req.body);
    return res.status(201).send({ status: false, data: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//==========================❌❌❌❌❌end❌❌❌❌❌======================================

//................................post Api loginUser.........................................
const createLogin = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;
  
    if(Object.keys(req.body).length===0){
      return res.status(400).send({status:false,msg:"request body is empty"})
    }
    
    if (!email)
      return res
        .status(400)
        .send({ status: false, msg: "email is not present in body" });

        
    if (!isValidString(email))
      return res.status(400).send({ status: false, msg: "email is wrong " });

    //checking if the email is correct or not
    if (!isEmailValid(email.trim()))
      return res
        .status(400)
        .send({ status: false, msg: "email is not valid " });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is not present " });

    let userDocument = await userModel.findOne({
      email: email.trim(),
      password: password.trim(),
    });
    if (!userDocument)
      return res.status(400).send({
        status: false,
        msg: "email or password is wrong or user not found with this details",
      });
    // creating token with the help of Jwt
    let token = jwt.sign(
      {
        userId: userDocument._id.toString(),
        group: "grp 42",
      },
      "project3group42", //secret key
      {expiresIn:"24h"}
    );

    return res
      .status(200)
      .send({ status: true, message: "Token Successfully created", data: token });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};
//==========================❌❌❌❌❌end❌❌❌❌❌======================================

module.exports = { createUser, createLogin };
