import {ReviewEntity} from "../../entities/review/ReviewEntity.js";
import {ReviewDTO} from "../types/review.js";
import {ShortUserDTO} from "../types/user.js";

export class ReviewMapper {
	static toDTO(entity: ReviewEntity, shortUserDTO: ShortUserDTO): ReviewDTO {
		return new ReviewDTO(entity, shortUserDTO);
	}

	static toDTOs(entities: ReviewEntity[], shortUserDTOs: ShortUserDTO[]): ReviewDTO[] {
		const userMap = new Map(shortUserDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const shortUserDTO = userMap.get(entity.userId);
			return this.toDTO(entity, shortUserDTO);
		});
	}
}