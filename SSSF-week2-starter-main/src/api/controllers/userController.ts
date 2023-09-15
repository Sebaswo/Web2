// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from req.user. No need for database query
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {User, UserOutput} from '../../interfaces/User';
import UserModel from '../models/userModel';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(12);

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const user = await UserModel.findById(req.params.id).select(
      '-password -__v'
    );

    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(user);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().select('-__v').select('role');
    if (!users || users.length === 0) {
      next(new CustomError('No users found', 404));
      return;
    }
    res.json(users);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const userPost = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userData = {
      ...req.body,
      password: hashedPassword,
    };

    const user = await UserModel.create(userData);
    const message: DBMessageResponse = {
      message: 'User created',
      data: {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      } as UserOutput,
    };
    res.status(200).json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      (req.user as User)._id,
      req.body,
      {
        new: true,
      }
    );

    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    const message: DBMessageResponse = {
      message: 'User updated',
      data: {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      } as UserOutput,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const userDeleteCurrent = async (
  req: Request<{id: string}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      (req.user as User)._id,
      req.body,
      {
        new: true,
      }
    );

    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    const message: DBMessageResponse = {
      message: 'User deleted',
      data: {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      } as UserOutput,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError('Something went wrong with the server', 500));
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new CustomError('token not valid', 403));
  } else {
    delete (req.user as UserOutput).password
    res.json(req.user);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
};