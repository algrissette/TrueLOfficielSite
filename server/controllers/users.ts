import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/users';
import db from '../util/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Create a new user
export const createUser = async (
  req: Request<{}, {}, IUser>, 
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, dob, sud } = req.body;

  // basic validation
  if (!firstName || !lastName || !email || !dob || sud === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result]: [ResultSetHeader, any] = await db.execute(
      'INSERT INTO users (FIRST_NAME, LAST_NAME, EMAIL, DOB, SUD) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, dob, sud]
    );

    res.status(201).json({
      message: 'User created',
      insertId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
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
  const id = parseInt(req.params.id, 10);

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
