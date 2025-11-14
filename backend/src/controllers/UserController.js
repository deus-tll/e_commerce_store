import {IUserService} from "../interfaces/user/IUserService.js";
import {CreateUserDTO, UpdateUserDTO} from "../domain/index.js";

import {ForbiddenError} from "../errors/apiErrors.js";

/**
 * Handles incoming HTTP requests related to user management (CRUD for Admins),
 * extracting request data, mapping it to DTOs, and delegating business logic to the IUserService.
 */
export class UserController {
	/** @type {IUserService} */ #userService;

	/**
	 * @param {IUserService} userService
	 */
	constructor(userService) {
		this.#userService = userService;
	}

	/**
	 * Creates a new user in the system. Typically used by an Admin to create
	 * other users (including other Admins). Extracts data from 'req.body' and maps
	 * it to a CreateUserDTO before delegation. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the created UserDTO.
	 */
	create = async (req, res, next) => {
		try {
			const { name, email, password, role, isVerified } = req.body;

			const createUserDTO = new CreateUserDTO({
				name,
				email,
				password,
				role,
				isVerified
			});

			const userDTO = await this.#userService.create(createUserDTO);

			return res.status(201).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an existing user's details based on the provided userId.
	 * Extracts partial update data from 'req.body' and maps it to an UpdateUserDTO. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params and update data in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO.
	 */
	update = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const updateData = req.body;

			const updateUserDTO = new UpdateUserDTO({
				...updateData
			});

			const userDTO = await this.#userService.update(userId, updateUserDTO);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes a user account by ID. Performs a security check to prevent self-deletion
	 * before delegating the operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the deleted UserDTO.
	 */
	delete = async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (userId === req.userId.toString()) {
				throw new ForbiddenError("You cannot delete your own account");
			}

			const userDTO = await this.#userService.delete(userId);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a paginated and filterable list of all users in the system.
	 * Extracts pagination and filtering parameters from 'req.query' and delegates the query. (Admin protected).
	 * @param {object} req - Express request object. Expects 'page', 'limit', 'role', and 'search' in req.query.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a UserPaginationResultDTO.
	 */
	getAll = async (req, res, next) => {
		try {
			const page = req.query.page;
			const limit = req.query.limit;

			const filters = req.query;

			const result = await this.#userService.getAll(page, limit, filters);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a single user's profile details by their ID, delegating the fetch operation. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the requested UserDTO.
	 */
	getById = async (req, res, next) => {
		try {
			const { userId } = req.params;

			const userDTO = await this.#userService.getByIdOrFail(userId);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves aggregated statistics about users (e.g., total count, admin count), delegating the request. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the UserStatsDTO.
	 */
	getStats = async (req, res, next) => {
		try {
			const stats = await this.#userService.getStats();

			return res.status(200).json(stats);
		}
		catch (error) {
			next(error);
		}
	}
}