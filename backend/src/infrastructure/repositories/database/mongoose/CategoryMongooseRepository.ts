import {MongoServerError} from "mongodb";
import {FilterQuery} from "mongoose";
import Category, {ICategoryDoc} from "./models/Category.js";

import {ICategoryRepository} from "../../../../application/category/ICategoryRepository.js";
import {CategoryAdapter} from "./adapters/CategoryAdapter.js";
import {CategoryEntity} from "../../../../entities/category/CategoryEntity.js";
import {
	CategoryCreatePersistence,
	CategoryUpdatePersistence,
	CategoryFiltersPersistence
} from "../../../../application/types/category.js";
import {RepositoryPaginationResult} from "../../../../application/types/shared.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../../../errors/index.js";

import {sanitizeSearchTerm} from "../../../../utils/sanitize.js";
import {determineSort} from "./utils.js";

export class CategoryMongooseRepository extends ICategoryRepository {
	private toEntityOrThrow(doc?: ICategoryDoc | null, criteria: any = {}): CategoryEntity {
		const entity = CategoryAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("Category", criteria);

		return entity;
	}

	private buildQuery(filters: CategoryFiltersPersistence) : FilterQuery<ICategoryDoc> {
		const { search } = filters;
		const query: FilterQuery<ICategoryDoc> = {};

		if (search) {
			const sanitizedTerm = sanitizeSearchTerm(search);
			if (sanitizedTerm) {
				query.name = new RegExp(sanitizedTerm, "i");
			}
		}

		return query;
	}

	async create(data: CategoryCreatePersistence): Promise<CategoryEntity> {
		try {
			const createdDoc = await Category.create(data);
			return CategoryAdapter.toEntityRequired(createdDoc);
		}
		catch (error: unknown) {
			if (error instanceof MongoServerError && error.code === 11000) {
				const keyPattern = error["keyPattern"];
				const key = Object.keys(keyPattern)[0] as keyof CategoryCreatePersistence;
				throw new EntityAlreadyExistsError("Category", { [key]: data[key] });
			}
			throw error;
		}
	}

	async updateById(id: string, data: CategoryUpdatePersistence): Promise<CategoryEntity> {
		const updatedDoc = await Category.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async deleteById(id: string): Promise<CategoryEntity> {
		const deletedDoc = await Category.findByIdAndDelete(id).lean();
		return this.toEntityOrThrow(deletedDoc, { id });
	}

	async findById(id: string): Promise<CategoryEntity | null> {
		const foundDoc = await Category.findById(id).lean();
		return CategoryAdapter.toEntity(foundDoc);
	}

	async findBySlug(slug: string): Promise<CategoryEntity | null>  {
		const foundDoc = await Category.findOne({ slug }).lean();
		return CategoryAdapter.toEntity(foundDoc);
	}

	async findAndCount(
		filters: CategoryFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<CategoryEntity>> {
		const { sortBy = "name", order = "asc", ...restFilters } = filters;

		const query = this.buildQuery(restFilters);

		const sortObject = determineSort(sortBy, order);

		const [foundDocs, total] = await Promise.all([
			Category.find(query)
				.sort(sortObject)
				.skip(skip)
				.limit(limit)
				.lean(),
			Category.countDocuments(query),
		]);

		const categoryEntities = foundDocs.map(doc => CategoryAdapter.toEntityRequired(doc));
		return new RepositoryPaginationResult(categoryEntities, total);
	}

	async findByIds(ids: string[]): Promise<CategoryEntity[]> {
		const foundDocs = await Category.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => CategoryAdapter.toEntityRequired(doc));
	}
}