import {UserEntity} from "../../../../../entities/user/UserEntity.js";
import {IUserDoc} from "../models/User.js";

import {normalizePersistence} from "../utils.js";

export class UserAdapter {
    private static buildEntity(data: ReturnType<typeof normalizePersistence<IUserDoc>>): UserEntity {
        return new UserEntity(data);
    }

    static toEntity(doc?: IUserDoc | null): UserEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: IUserDoc): UserEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}