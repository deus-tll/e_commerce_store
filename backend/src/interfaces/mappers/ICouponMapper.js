import {CouponEntity, CouponDTO} from "../../domain/index.js";

/**
 * @interface ICouponMapper
 * @description Defines the contract for converting Coupon entities (from Repository)
 * into CouponDTOs (for Controllers/Consumers).
 */
export class ICouponMapper {
	/**
	 * Converts a Coupon entity object to the standard CouponDTO.
	 * @param {CouponEntity} entity - The Coupon entity record received from the repository.
	 * @returns {CouponDTO} - The mapped CouponDTO.
	 */
	toDTO(entity) { throw new Error("Method not implemented."); }
}