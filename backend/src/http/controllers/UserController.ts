import {Request, Response} from "express";

import {UserService} from "../../application/user/UserService.js";
import {UserStatsService} from "../../application/user/UserStatsService.js";

import {UserCreateRequest, UserGetAllQuery, UserUpdateRequest} from "../requests/user.js";
import {ParamsWithIdRequest} from "../requests/shared.js";

import {ActionNotAllowedError} from "../../errors/index.js";

export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly userStatsService: UserStatsService
	) {}

	create = async (req: UserCreateRequest, res: Response): Promise<Response> => {
		const userDTO = await this.userService.create(req.body);
		return res.status(201).json(userDTO);
	}

	update = async (req: UserUpdateRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const userDTO = await this.userService.update(id, req.body, req.user);

		return res.status(200).json(userDTO);
	}

	delete = async (req: ParamsWithIdRequest, res: Response): Promise<Response> => {
		const { id } = req.params;

		if (id === req.user.id) {
			throw new ActionNotAllowedError("You cannot delete your own account");
		}

		const userDTO = await this.userService.delete(id);

		return res.status(200).json(userDTO);
	}

	getAll = async (req: Request, res: Response): Promise<Response> => {
		const query = req.query as unknown as UserGetAllQuery;
		const { page, limit, ...filters } = query;
		const paginationResult = await this.userService.getAll(page, limit, filters);

		return res.status(200).json(paginationResult);
	}

	getById = async (req: ParamsWithIdRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const userDTO = await this.userService.getByIdOrFail(id);

		return res.status(200).json(userDTO);
	}

	getStats = async (_: Request, res: Response): Promise<Response> => {
		const stats = await this.userStatsService.calculateStats();
		return res.status(200).json(stats);
	}
}