import {ICouponRepository} from "./ICouponRepository.js";
import {UserService} from "../user/UserService.js";
import {CouponValidator} from "./CouponValidator.js";
import {CouponMapper} from "./CouponMapper.js";

import {CouponEntity} from "../../entities/coupon/CouponEntity.js";
import {CouponCreatePersistence, CouponDTO, CouponValidationDTO} from "../types/coupon.js";

export class CouponService {
	constructor(
		private readonly couponRepository: ICouponRepository,
		private readonly userService: UserService,
		private readonly couponValidator: CouponValidator,
		private readonly discountPercentage: number
	) {}

	private formDTO(entity?: CouponEntity): CouponDTO | null {
		return entity ? CouponMapper.toDTO(entity) : null;
	}

	async create(userId: string): Promise<CouponDTO> {
		await this.userService.getByIdOrFail(userId);

		const couponCreatePersistence: CouponCreatePersistence = CouponEntity.prepareCreatePersistence(this.discountPercentage);
		const createdEntity = await this.couponRepository.replaceOrCreate(userId, couponCreatePersistence);

		return this.formDTO(createdEntity);
	}

	async deactivate(code: string, userId: string): Promise<CouponDTO> {
		const updatedEntity = await this.couponRepository.updateCouponActiveState(code, userId, false);
		return this.formDTO(updatedEntity);
	}

	async validate(code: string, userId: string): Promise<CouponValidationDTO> {
		return await this.couponValidator.validate(code, userId);
	}

	async getActiveByUserId(userId: string): Promise<CouponDTO | null> {
		const entity = await this.couponRepository.findActiveByUserId(userId);
		return this.formDTO(entity);
	}

	async getActiveByCodeAndUserId(code: string, userId: string): Promise<CouponDTO | null> {
		const entity = await this.couponRepository.findByCodeAndUserId(code, userId);

		if (!entity) return null;
		if (!entity.isActive) return null;
		if (entity.isExpired()) return null;

		return this.formDTO(entity);
	}
}