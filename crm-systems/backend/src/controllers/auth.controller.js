import dotenv from 'dotenv'
import User from "../models/User.js";
import { loginSchema , registerSchema } from "../validators/auth.schema.js";
import jwt from 'jsonwebtoken';
import { ZodError } from "zod";

export const register = async (req , res) => {
    try {

        // getting the validated - data from zod schema 
        const validatedData = registerSchema.parse(req.body);

        // destructuring the user data from validated data
        const { name, email, password } = validatedData;


        //checking if the user exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: 'User Already exists'
            });
        }

        const user = await User.create({ name, email, password   })

        res.status(201).json({
            message: 'User Registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
            },
        });
        
    }

    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        res.status(500).json({
            message:'Server error',
        })
        console.log(error)
        
    }
}

//defining the login controller function from importing the validated loginSchema 
export const login = async (req, res) => {
    try {



        // step-1: validating the data ====> getting validated data after parsing the request body
        const validatedData = loginSchema.parse(req.body);

        //simple destructuring recieved data into emails and password
        const { email, password } = validatedData

        //step -2 finding the User and selecting the password
        const user = await User.findOne({ email }).select('+password');

        //check if user not present return 401
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        //step - 3
        //check the status of the user if active
        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account is Deactivated',
            });
        }

        //step - 4
        //comparing the password with using custom made schema method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }
        
        //step - 5
        //generating the JWT Token 

        const token = jwt.sign({
            userId: user._id, role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }

        );


        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            },
        });

        
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }
        res.status(500).json({
            message: 'Server error'
        });
        
    }
}