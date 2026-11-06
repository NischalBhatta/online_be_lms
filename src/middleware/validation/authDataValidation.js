import Joi from "joi";
import { responseClient } from "../responseClient.js";
import { validateData } from "./joiValidation.js";
import {
  EMAILREQ,
  FNAMEREQ,
  LNAMEREQ,
  PASSWORDREQ,
  PHONEREQ,
  SESSIONREQ,
  TOKENREQ,
} from "./joiConst.js";

export const newUserDataValidation = (req, res, next) => {
  const obj = {
    fName: FNAMEREQ,
    lName: LNAMEREQ,
    email: EMAILREQ,
    phone: PHONEREQ,
    password: PASSWORDREQ,
  };

  validateData({ req, res, next, obj });
};

export const userActivationDataValidation = (req, res, next) => {
  //         {
  //     "fName": "Nischal",
  //     "lName": "Bhatta",
  //     "email": "b@a.com",
  //     "phone": "41221345",
  //     "password": "1234",
  //     "role": "admin",
  //     "refreshJWT": "string"
  // }
  //create schema or rules
  const obj = {
    sessionId: SESSIONREQ,
    t: TOKENREQ,
  };

  validateData({ req, res, next, obj });
};

export const loginDataValidation = (req, res, next) => {
  //         {
  //     "fName": "Nischal",
  //     "lName": "Bhatta",
  //     "email": "b@a.com",
  //     "phone": "41221345",
  //     "password": "1234",
  //     "role": "admin",
  //     "refreshJWT": "string"
  // }
  //create schema or rules
  const obj = {
    email: EMAILREQ,
    password: PASSWORDREQ,
  };

  validateData({ req, res, next, obj });
};
