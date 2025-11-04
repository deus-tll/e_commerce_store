import {IProductMapper} from "../../interfaces/mappers/IProductMapper.js";
import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {ProductDTO, ShortProductDTO} from "../../domain/index.js";

/**
 * @augments IProductMapper
 * @description Concrete implementation of the IProductMapper interface.
 */
export class ProductMapper extends IProductMapper {
	/** @type {ICategoryService} */ #categoryService;

	/**
	 * @param {ICategoryService} categoryService - The category service dependency.
	 */
	constructor(categoryService) {
		super();
		this.#categoryService = categoryService;
	}

	async toDTO(entity) {
		const categoryDTO = await this.#categoryService.getById(entity.categoryId);

		return new ProductDTO(entity, categoryDTO);
	}

	async toDTOs(entities) {
		return Promise.all(entities.map(entity => this.toDTO(entity)));
	}

	toShortDTO(entity) {
		return new ShortProductDTO(entity);
	}

	toShortDTOs(entities) {
		return entities.map(entity => this.toShortDTO(entity));
	}
}