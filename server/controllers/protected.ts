import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const jwtPassword = process.env.JWTSECRETKEY;


export const checkAuth = (req: Request, res: Response) => {
  console.log(req.cookies)
  const token = req.cookies.truceCookieName;

  if (!token) {
    console.log('oops')

    return res.status(401).json({ message: "No token", authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, jwtPassword!);
    return res.status(200).json({
      authenticated: true,
      user: decoded,
    });
  } catch {
    return res.status(401).json({ message: "idk", authenticated: false });
  }
};


export const logout = (req: Request, res: Response) => {
  try {
    // Clear the truceCookieName cookie
    res.clearCookie("truceCookieName", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Clear the userId cookie
    res.clearCookie("userId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      success: false,
    });
  }
};
