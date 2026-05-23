import * as express from "express";
import {UserDTO} from "../domain/index.js";

declare global {
    namespace Express {
        interface Request {
            user: UserDTO
        }
    }
}