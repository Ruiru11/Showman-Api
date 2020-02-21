import jwt from "jsonwebtoken";
import keys from "../config/keys";

export const jwtSignature = payload => {
  return jwt.sign(
    {
      data: payload
    },
    keys.secretOrKey
  );
};

export const jwtVerify = token => {
  try {
    return jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return {
          error: err.Username,
          message: `${err.message} Not valid`
        };
      } else {
        return decoded.data;
      }
    });
  } catch (err) {
    return {
      error: err.Username,
      message: err.message
    };
  }
};