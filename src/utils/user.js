import { userExists } from "../routes/api/verify";

export const Verify = (req, res, next) => {
  let token = req.query.token;
  userExists(token)
    .then(response =>
      res
        .status(200)
        .json({ message: "Your email has been verified", response })
    )
    .catch(err => {
      next(err);
      return res.status(400).json({ message: err.message });
    });
};