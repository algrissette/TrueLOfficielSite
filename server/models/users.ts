import db from '../util/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';


//schema for mysql db table for users

// TypeScript interface for a user row

export interface IUser {
  id?: number;           
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: Date;           // or Date
  sud: Date;
}
