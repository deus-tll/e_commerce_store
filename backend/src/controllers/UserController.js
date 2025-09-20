import {UserService} from "../services/UserService.js";
import {BadRequestError, ForbiddenError} from "../errors/apiErrors.js";

export class UserController {
	constructor() {
		this.userService = new UserService();
	}

	getAllUsers = async (req, res, next) => {
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
			if (req.query.role && ['customer', 'admin'].includes(req.query.role)) {
				filters.role = req.query.role;
			}
			if (req.query.isVerified !== undefined) {
				filters.isVerified = req.query.isVerified === 'true';
			}
			if (req.query.search?.trim()) {
				filters.search = req.query.search.trim();
			}

			const result = await this.userService.getAllUsers(page, limit, filters);

			const usersDTO = result.users.map(user => this.userService.toDTO(user));

			return res.status(200).json({
				users: usersDTO,
				pagination: result.pagination
			});
		}
		catch (error) {
			next(error);
		}
	}

	getUserById = async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (!userId?.trim()) {
				throw new BadRequestError("User ID is required");
			}

			const user = await this.userService.getUserById(userId.trim());
			const userDTO = this.userService.toDTO(user);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	createUser = async (req, res, next) => {
		try {
			const { name, email, password, role, isVerified } = req.body;

			if (!name?.trim() || !email?.trim() || !password) {
				throw new BadRequestError("Name, email and password are required");
			}

			if (role && !['customer', 'admin'].includes(role)) {
				throw new BadRequestError("Invalid role. Must be 'customer' or 'admin'");
			}

			const userData = {
				name: name.trim(),
				email: email.trim(),
				password,
				role: role || 'customer',
				isVerified: isVerified === true
			};

			const user = await this.userService.createUser(userData);
			const userDTO = this.userService.toDTO(user);

			return res.status(201).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	updateUser = async (req, res, next) => {
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

			if (filteredData.role && !['customer', 'admin'].includes(filteredData.role)) {
				throw new BadRequestError("Invalid role. Must be 'customer' or 'admin'");
			}

			const updatedUser = await this.userService.updateUser(userId.trim(), filteredData);
			const userDTO = this.userService.toDTO(updatedUser);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	deleteUser = async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (!userId?.trim()) {
				throw new BadRequestError("User ID is required");
			}

			if (userId === req.user._id.toString()) {
				throw new ForbiddenError("You cannot delete your own account");
			}

			const deletedUser = await this.userService.deleteUser(userId.trim());
			const userDTO = this.userService.toDTO(deletedUser);

			return res.status(200).json(userDTO);
		}
		catch (error) {
			next(error);
		}
	}

	getUserStats = async (req, res, next) => {
		try {
			const [totalUsers, verifiedUsers, adminUsers] = await Promise.all([
				this.userService.getAllUsers(1, 1),
				this.userService.getAllUsers(1, 1, { isVerified: true }),
				this.userService.getAllUsers(1, 1, { role: 'admin' })
			]);

			const stats = {
				total: totalUsers.pagination.total,
				verified: verifiedUsers.pagination.total,
				unverified: totalUsers.pagination.total - verifiedUsers.pagination.total,
				admins: adminUsers.pagination.total,
				customers: totalUsers.pagination.total - adminUsers.pagination.total
			};

			res.status(200).json(stats);
		}
		catch (error) {
			next(error);
		}
	}
}