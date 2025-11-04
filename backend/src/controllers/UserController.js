import {IUserService} from "../interfaces/user/IUserService.js";
import {CreateUserDTO, UpdateUserDTO} from "../domain/index.js";

import {BadRequestError, ForbiddenError} from "../errors/apiErrors.js";

import {UserRoles} from "../utils/constants.js";

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

			if (!name?.trim() || !email?.trim() || !password) {
				throw new BadRequestError("Name, email and password are required");
			}

			if (role && ![UserRoles.CUSTOMER, UserRoles.ADMIN].includes(role)) {
				throw new BadRequestError(`Invalid role. Must be '${UserRoles.CUSTOMER}' or '${UserRoles.ADMIN}'`);
			}

			const createUserDTO = new CreateUserDTO({
				name: name.trim(),
				email: email.trim(),
				password,
				role: role || UserRoles.CUSTOMER,
				isVerified: isVerified === true
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

			if (!userId?.trim()) {
				throw new BadRequestError("User ID is required");
			}

			const allowedFields = ['name', 'email', 'role', 'isVerified'];
			const filteredData = {};

			allowedFields.forEach(field => {
				if (updateData[field] !== undefined) {
					filteredData[field] = updateData[field];
				}
			});

			if (Object.keys(filteredData).length === 0) {
				throw new BadRequestError("No valid fields provided for update");
			}

			if (filteredData.role && ![UserRoles.CUSTOMER, UserRoles.ADMIN].includes(filteredData.role)) {
				throw new BadRequestError(`Invalid role. Must be '${UserRoles.CUSTOMER}' or '${UserRoles.ADMIN}'`);
			}

			const updateUserDTO = new UpdateUserDTO({
				...filteredData
			});

			const userDTO = await this.#userService.update(userId.trim(), updateUserDTO);

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

			if (!userId?.trim()) {
				throw new BadRequestError("User ID is required");
			}

			if (userId === req.userId.toString()) {
				throw new ForbiddenError("You cannot delete your own account");
			}

			const userDTO = await this.#userService.delete(userId.trim());

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
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;

			if (page < 1 || limit < 1) {
				throw new BadRequestError("Page and limit must be positive numbers");
			}

			if (limit > 100) {
				throw new BadRequestError("Limit cannot exceed 100 users per page");
			}

			const filters = {};
			if (req.query.role && [UserRoles.CUSTOMER, UserRoles.ADMIN].includes(req.query.role)) {
				filters.role = req.query.role;
			}
			if (req.query.isVerified !== undefined) {
				filters.isVerified = req.query.isVerified === 'true';
			}
			if (req.query.search?.trim()) {
				filters.search = req.query.search.trim();
			}

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

			if (!userId?.trim()) {
				throw new BadRequestError("User ID is required");
			}

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