import { Request, Response, NextFunction, response } from 'express';
import { IUser } from '../models/users';
import db from '../util/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const jwtPassword = process.env.JWTSECRETKEY


dotenv.config()

export const signIn = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!checkPasswordCriteria(password)) {
      return res
        .status(400)
        .json({ message: "Password must have 8 characters, 1 number and one capital" });
    }

    const user = await checkPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendCookie(user.id, res);
  } catch (err) {
    next(err);
  }
};


export const sendCookie = (userId: number, res: Response) => {
  if (!jwtPassword) {
    throw new Error("JWT secret not defined in environment variables");
  }

  // Generate JWT token
  const token = jwt.sign({ userId }, jwtPassword, { expiresIn: "1h" });
  console.log("Generated JWT:", token);

  // First cookie: the JWT
  res.cookie("truceCookieName", token, {
    httpOnly: true,
    secure: true,       // false on localhost, true in production
    sameSite: "none",
    path: "/",
    maxAge: 3600 * 1000, // 1 hour
  });

  // Second cookie: plain user ID
  res.cookie("userId", userId.toString(), {
    httpOnly: false,    // userId can be read by JS if needed
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 3600 * 1000, // 1 hour
  });

  // Finally, send JSON response
  res.json({ message: "User is logged in" });
};


const userExists = async (email: string): Promise<boolean> => {
  const [rows] = await db.execute(
    "SELECT 1 FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return (rows as any[]).length > 0;
};



const checkPasswordCriteria = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  return passwordRegex.test(password)

}



const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


const checkPassword = async (
  email: string,
  enteredPassword: string
): Promise<{ id: number } | null> => {
  const [rows] = await db.execute(
    "SELECT id, PASSWORD FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  const user = (rows as any[])[0];
  if (!user) return null;

  const isValid = await bcrypt.compare(enteredPassword, user.PASSWORD);
  if (!isValid) return null;

  return { id: user.id };
};


// Create a new user
export const createUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, dob, sud } = req.body;

  if (!firstName || !lastName || !email || !dob || !password || sud === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (await userExists(email)) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!checkPasswordCriteria(password)) {
      return res
        .status(400)
        .json({ message: "Password must have 8 characters, 1 number and one capital" });
    }

    const hashedPassword = await hashPassword(password);

    const [result]: [ResultSetHeader, any] = await db.execute(
      `INSERT INTO users (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, DOB, SUD)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, dob, sud]
    );

    sendCookie(result.insertId, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

//add a quantity to db table to avoid dupicate items
//saved item variant id is unique 




export const saveItemInDatabase = async (req: Request, res: Response) => {
  const variantId = req.body.variantId;
  const userId = req.cookies.userId; // read from cookie

  if (!userId || !variantId) {
    return res.status(400).json({ error: "Missing userId or variantId" });
  }

  try {
    await db.execute(
      `
      INSERT INTO user_saved (USER_ID, VARIANT, QUANTITY)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE quantity = quantity + 1
      `,
      [userId, variantId]
    );

    res.status(200).json({ success: true, message: "Item saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save item", details: err });
  }
};


export const getSavedItems = async (req: Request, res: Response) => {
  console.log("starting")

  const userId = req.cookies.userId;


  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM user_saved WHERE USER_ID = ?`,
      [userId]
    );

    console.log(rows)

    res.status(200).json({ success: true, items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch saved items", details: err });
  }
};



export const deleteSavedItem = async (req: Request, res: Response) => {
  const userId = req.cookies.userId;
  const savedItemId = req.body.savedItemId;
  console.log("hellooo")

  if (!userId || !savedItemId) {
    console.log("ID", userId)
    console.log("saved item", savedItemId)


    return res.status(400).json({ error: "Missing userId or savedItemId" });

  }

  try {
    // Get 
    // current quantity
    console.log("done1")

    const [rows]: any = await db.execute(
      `SELECT quantity FROM user_saved WHERE VARIANT = ? AND USER_ID = ?`,
      [savedItemId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Saved item not found" });
    }
    console.log("done2")

    const quantity = rows[0].quantity;

    if (quantity > 1) {
      console.log("done3")

      // Decrement quantity
      await db.execute(
        `UPDATE user_saved SET quantity = quantity - 1 WHERE VARIANT = ? AND USER_ID = ?`,
        [savedItemId, userId]
      );
    } else {
      // Delete item
      console.log("done4")

      await db.execute(
        `DELETE FROM user_saved WHERE VARIANT = ? AND USER_ID = ?`,
        [savedItemId, userId]
      );
    }


    res.status(200).json({ success: true, message: "Saved item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update saved item", details: err });
  }
};


// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows]: [RowDataPacket[], any] = await db.execute('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get user by ID
export const getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const id = req.cookies.userId;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const [rows]: [RowDataPacket[], any] = await db.execute(
      'SELECT * FROM users WHERE ID = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


export const updateEmail = () => {

}