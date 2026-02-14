import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {ICouponRepository} from "../../interfaces/repositories/ICouponRepository.js";
import {ICouponValidator} from "../../interfaces/coupon/ICouponValidator.js";
import {ICouponFactory} from "../../interfaces/coupon/ICouponFactory.js";
import {ICouponMapper} from "../../interfaces/mappers/ICouponMapper.js";

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

		const createCouponDTO = this.#couponFactory.create(userId);
		const createdCoupon = await this.#couponRepository.create(createCouponDTO.toPersistence());

		return this.#couponMapper.toDTO(createdCoupon);
	}

	async deactivate(code, userId) {
		const updatedCoupon = await this.#couponRepository.updateCouponActiveState(code, userId, false);
		return this.#couponMapper.toDTO(updatedCoupon);
	}

	async validate(code, userId) {
		return await this.#couponValidator.validate(code, userId);
	}

	async getActiveByUserId(userId) {
		const couponEntity = await this.#couponRepository.findActiveByUserId(userId);
		return couponEntity ? this.#couponMapper.toDTO(couponEntity) : null;
	}

	async getActiveByCodeAndUserId(code, userId) {
		const couponEntity = await this.#couponRepository.findByCodeAndUserId(code, userId);

		if (!couponEntity) return null;
		if (!couponEntity.isActive) return null;
		if (couponEntity.isExpired()) return null;

		return this.#couponMapper.toDTO(couponEntity);
	}
}