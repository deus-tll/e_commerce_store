import * as express from "express";
import {UserDTO} from "../application/types/user.js";

declare global {
    namespace Express {
        interface Request {
            user: UserDTO
        }
    }
}