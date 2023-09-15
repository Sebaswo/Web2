import { Document } from "mongoose";

interface User extends Document {
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

interface LoginUser extends User {
  username: string;
}

interface UserOutput {
  _id?: string;
  user_name: string;
  email: string;
  password?: string;
}

interface UserTest {
  user_name: string;
  email: string;
  password: string;
}

export {User, LoginUser, UserOutput, UserTest};
