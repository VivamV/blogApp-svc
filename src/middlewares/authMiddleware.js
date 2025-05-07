
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

  console.log("process env secret",process.env.SECRET_KEY,process.env.PORT)
const token = req.headers.authorization?.split(' ')[1];
  // console.log("bh",token)

  if (!token) {
    return res.json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded",decoded);
    req.user = decoded; 
    // console.log("passed from here");
    return next();
  } catch (err) {
    return res.json({ message: "Token is not valid, or it's expired" });
  }
};

export default auth;
