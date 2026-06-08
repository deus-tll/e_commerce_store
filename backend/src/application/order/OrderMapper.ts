import {OrderDTO} from "../types/order.js";
import {OrderEntity} from "../../entities/order/OrderEntity.js";
import {ShortUserDTO} from "../types/user.js";

export class OrderMapper {
	static toDTO(entity: OrderEntity, shortUserDTO: ShortUserDTO): OrderDTO {
		return new OrderDTO(entity, shortUserDTO);
	}

	static toDTOs(entities: OrderEntity[], shortUserDTOs: ShortUserDTO[]): OrderDTO[] {
		const userMap = new Map(shortUserDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const shortUserDTO = userMap.get(entity.userId);
			return this.toDTO(entity, shortUserDTO);
		});
	}
}