import {IUserService} from "../interfaces/user/IUserService.js";
import {CreateUserDTO, UpdateUserDTO} from "../domain/index.js";

import {ForbiddenError} from "../errors/apiErrors.js";

/**
 * Handles incoming HTTP requests related to user management (CRUD for Admins),
 * extracting request data, mapping it to DTOs, and delegating business logic to the IUserService.
 */
export class UserController {
	/** @type {IUserService} */ #userService;
	/** @type {IUserStatsService} */ #userStatsService;

	/**
	 * @param {IUserService} userService
	 * @param {IUserStatsService} userStatsService
	 */
	constructor(userService, userStatsService) {
		this.#userService = userService;
		this.#userStatsService = userStatsService;
	}

	/**
	 * Creates a new user in the system. Typically used by an Admin to create
	 * other users (including other Admins). Extracts data from 'req.body' and maps
	 * it to a CreateUserDTO before delegation. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 201 and the created UserDTO.
	 */
	create = async (req, res) => {
		const createUserDTO = new CreateUserDTO(req.body);
		const userDTO = await this.#userService.create(createUserDTO);

		return res.status(201).json(userDTO);
	}

	/**
	 * Updates an existing user's details based on the provided userId.
	 * Extracts partial update data from 'req.body' and maps it to an UpdateUserDTO. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params and update data in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO.
	 */
	update = async (req, res) => {
		const { userId } = req.params;

		const updateUserDTO = new UpdateUserDTO(req.body);
		const userDTO = await this.#userService.update(userId, updateUserDTO, req.user);

		return res.status(200).json(userDTO);
	}

	/**
	 * Deletes a user account by ID. Performs a security check to prevent self-deletion
	 * before delegating the operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the deleted UserDTO.
	 */
	delete = async (req, res) => {
		const { userId } = req.params;

		if (userId === req.userId) {
			throw new ForbiddenError("You cannot delete your own account");
		}

		const userDTO = await this.#userService.delete(userId);

		return res.status(200).json(userDTO);
	}

	/**
	 * Retrieves a paginated and filterable list of all users in the system.
	 * Extracts pagination and filtering parameters from 'req.query' and delegates the query. (Admin protected).
	 * @param {object} req - Express request object. Expects 'page', 'limit', 'role', and 'search' in req.query.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a UserPaginationResultDTO.
	 */
	getAll = async (req, res) => {
		const { page, limit, ...rest } = req.query;
		const paginationResult = await this.#userService.getAll(page, limit, {...rest});

		return res.status(200).json(paginationResult);
	}

	/**
	 * Retrieves a single user's profile details by their ID, delegating the fetch operation. (Admin protected).
	 * @param {object} req - Express request object. Expects 'userId' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested UserDTO.
	 */
	getById = async (req, res) => {
		const { userId } = req.params;
		const userDTO = await this.#userService.getByIdOrFail(userId);

		return res.status(200).json(userDTO);
	}

	/**
	 * Retrieves aggregated statistics about users (e.g., total count, admin count), delegating the request. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the UserStatsDTO.
	 */
	getStats = async (req, res) => {
		const stats = await this.#userStatsService.calculateStats();
		return res.status(200).json(stats);
	}
}