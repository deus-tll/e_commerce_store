import {ProductEntity, ProductDTO, ShortProductDTO} from "../../domain/index.js";

/**
 * @interface IProductMapper
 * @description Defines the contract for converting Product entities (from Repository)
 * into various DTO forms (for Controllers/Consumers).
 */
export class IProductMapper {
	/**
	 * Converts a Product entity object to the standard ProductDTO, resolving dependencies like Category.
	 * @param {ProductEntity} entity - The Product entity record received from the repository.
	 * @param {CategoryDTO} categoryDTO - The category DTO for enriching product.
	 * @returns {ProductDTO} - The mapped ProductDTO.
	 */
	toDTO(entity, categoryDTO) { throw new Error("Method not implemented."); }

	/**
	 * Converts a Product entity object into a summarized ShortProductDTO.
	 * @param {ProductEntity} entity - The Product entity record received from the repository.
	 * @returns {ShortProductDTO}  - The mapped ShortProductDTO.
	 */
	toShortDTO(entity) { throw new Error("Method not implemented."); }

	/**
	 * Converts an array of Product entities to an array of summarized ShortProductDTOs.
	 * @param {ProductEntity[]} entities - Array of Product entity records.
	 * @returns {ShortProductDTO[]} - Array of mapped ShortProductDTOs.
	 */
	toShortDTOs(entities) { throw new Error("Method not implemented."); }
}