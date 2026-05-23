import {UserQueryParser} from "../../../application/user/UserQueryParser.js";

import {ParserTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerParsers = (container) => {
    container.register(ParserTypes.USER_QUERY, UserQueryParser, []);
}

export default registerParsers;