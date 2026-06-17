import {UserEntity} from "../../../../../entities/user/UserEntity.js";
import {IUserDoc} from "../models/User.js";

import {normalizePersistence} from "../utils.js";

export class UserAdapter {
    static toEntity(doc?: IUserDoc): UserEntity | null {
        const data = normalizePersistence(doc);
        return data ? new UserEntity(data) : null;
    }
}