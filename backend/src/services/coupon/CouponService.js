import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {ICouponRepository} from "../../interfaces/repositories/ICouponRepository.js";
import {ICouponValidator} from "../../interfaces/coupon/ICouponValidator.js";
import {ICouponFactory} from "../../interfaces/coupon/ICouponFactory.js";
import {ICouponMapper} from "../../interfaces/mappers/ICouponMapper.js";
import {UpdateCouponDTO} from "../../domain/index.js";

import {NotFoundError} from "../../errors/apiErrors.js";

/**
 * @augments ICouponService
 * @description Agnostic business logic layer for coupon operations.
 * Coordinates between the Coupon Repository and User Service.
 */
export class CouponService extends ICouponService {
	/** @type {ICouponRepository} */ #couponRepository;
	/** @type {ICouponValidator} */ #couponValidator;
	/** @type {ICouponFactory} */ #couponFactory;
	/** @type {ICouponMapper} */ #couponMapper;

	/**
	 * @param {ICouponRepository} couponRepository
	 * @param {ICouponValidator} couponValidator
	 * @param {ICouponFactory} couponFactory
	 * @param {ICouponMapper} couponMapper
	 */
	constructor(couponRepository, couponValidator, couponFactory, couponMapper) {
		super();
		this.#couponRepository = couponRepository;
		this.#couponValidator = couponValidator;
		this.#couponFactory = couponFactory;
		this.#couponMapper = couponMapper;
	}

	async create(userId) {
		await this.#couponValidator.validateUserExists(userId);
		await this.#couponRepository.deleteByUserId(userId);

		const createCouponDTO = this.#couponFactory.createDTO(userId);

		const createdCoupon = await this.#couponRepository.create(createCouponDTO);

		return this.#couponMapper.toDTO(createdCoupon);
	}

	async deactivate(code, userId) {
		const updateCouponDTO = new UpdateCouponDTO({
			code,
			userId,
			isActive: false
		});

		const updatedCoupon = await this.#couponRepository.updateByCodeAndUserId(updateCouponDTO);

		if (!updatedCoupon) {
			throw new NotFoundError("Coupon not found");
		}

		return this.#couponMapper.toDTO(updatedCoupon);
	}

	async validate(code, userId) {
		return await this.#couponValidator.validate(code, userId);
	}

	async getActiveByUserId(userId) {
		const couponEntity = await this.#couponRepository.findActiveByUserId(userId);
		return couponEntity ? this.#couponMapper.toDTO(couponEntity) : null;
	}

	async getActiveByUserIdOrFail(userId) {
		const couponDTO = await this.getActiveByUserId(userId);

		if (!couponDTO) {
			throw new NotFoundError("Active coupon not found for this user");
		}

		return couponDTO;
	}

	async getActiveByCodeAndUserId(code, userId) {
		const couponEntity = await this.#couponRepository.findByCodeAndUserId(code, userId);

		if (!couponEntity) return null;
		if (!couponEntity.isActive) return null;
		if (couponEntity.isExpired()) return null;

		return this.#couponMapper.toDTO(couponEntity);
	}

	async getActiveByCodeAndUserIdOrFail(code, userId) {
		const couponDTO = await this.getActiveByCodeAndUserId(code, userId);

		if (!couponDTO) {
			throw new NotFoundError("Active coupon not found");
		}

		return couponDTO;
	}
}