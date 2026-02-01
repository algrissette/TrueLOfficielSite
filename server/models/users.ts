import db from '../util/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';


//schema for mysql db table for users

// TypeScript interface for a user row
// TypeScript interface for a row in the USERS table
export interface IUser {
  id?: number;            // auto-incremented
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: Date;
  sud: Date;
  cart?: string;          // was number? now string (link)
  // saved?: removed — handled by USER_SAVED table
}
