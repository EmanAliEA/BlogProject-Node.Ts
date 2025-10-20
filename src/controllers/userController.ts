
import * as bcrypt from 'bcrypt';
import { User } from '../models/user';
import type { Request, Response } from 'express';

// get user 
const getUser = async(req:Request , res :Response , message?:string)=>{
    const user = User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(message || 'User already registered');
    return user;
}

// create new user
const createUser  =  async(req:Request , res :Response)=>{
    // create new user
    const newUser = new User(req.body);
     // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    // save user to DB 
    await newUser.save();

    // return 200
    return res.status(200).send({ message: 'User registered successfully' });
}


// check if password is valid
const isValidPassword = async (req: Request, res: Response , password:string) => {
    const isValidUser = await bcrypt.compare(req.body.password, password);
    if (!isValidUser) return res.status(400).send('Invalid email or password');
    return;
}


export {getUser , createUser , isValidPassword};