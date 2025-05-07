import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userSchema.js";
import Cookies from 'js-cookie'

export const signupController = async (req, res) => {
// console.log("register",req.body);
  const { fullname, email, password ,profileimagePath} = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.json({ message: "User Already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      profileimageURL:profileimagePath
    });
// console.log("resukt",result);
    res.status(200).json({ user: result });
    // res.send("User Registered Successfully");
  } catch (error) {
    // console.log("error lelo",error.path);
    // console.log("ghus gaya signup ke catch mein");
    res.status(500).json({ message: "Something went wrong,cant register"});
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      return res.json({ message: "User Not found" });//404
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.json({ message: "Invalid credentials" });//400
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY
      ,  { expiresIn: '15m' }
    );
    res.cookie('token', token);
    Cookies.set('token',token)
    // console.log(token);
    // console.log("token set in cookies");
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

