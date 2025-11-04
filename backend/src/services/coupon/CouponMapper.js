import {ICouponMapper} from "../../interfaces/mappers/ICouponMapper.js";
import {CouponDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the ICouponMapper interface.
 * @augments ICouponMapper
 */
export class CouponMapper extends ICouponMapper {
	toDTO(entity) {
		return new CouponDTO(entity);
	}
}