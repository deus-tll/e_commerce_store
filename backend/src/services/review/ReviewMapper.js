import {IReviewMapper} from "../../interfaces/mappers/IReviewMapper.js";
import {ReviewDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the IReviewMapper interface.
 * @augments IReviewMapper
 */
export class ReviewMapper extends IReviewMapper {
	toDTO(entity, shortUserDTO) {
		return new ReviewDTO(entity, shortUserDTO);
	}
}