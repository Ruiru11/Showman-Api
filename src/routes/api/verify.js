import { jwtVerify } from "../../validations/jwtService";
import User from "../../models/users";

export async function userExists(token) {
  let email = jwtVerify(token);
  let user = await User.findOne({ email: email });

  if (!user)
    throw {
      status: 404,
      message: "User not found"
    };
  if (user.isVerified)
    throw {
      status: 400,
      message: "User is already verified"
    };
  Object.assign(user, {
    isVerified: true
  });
  await user.save();
  return user;
}