import {FilterQuery} from "mongoose";

import Category, {ICategoryDoc} from "../../models/mongoose/Category.js";

import {ICategoryRepository} from "../../interfaces/category/ICategoryRepository.js";
import {
	CategoryEntity,
	CreateCategoryPersistence,
	UpdateCategoryPersistence,
	RepositoryPaginationResult
} from "../../domain/index.js";
import {CategoryAdapter} from "./adapters/CategoryAdapter.js";
import {EntityAlreadyExistsError, EntityNotFoundError} from "../../errors/index.js";

import {sanitizeSearchTerm} from "../../utils/sanitize.js";

/**
 * Mongoose implementation of the abstract contract for Category persistence operations.
 */
export class CategoryMongooseRepository extends ICategoryRepository {
	#buildMongooseQuery(query: Record<string, any>) : FilterQuery<ICategoryDoc> {
		const mongooseQuery: FilterQuery<ICategoryDoc> = {};

		if (query.search) {
			const sanitizedTerm = sanitizeSearchTerm(query.search);
			mongooseQuery.name = new RegExp(sanitizedTerm, "i");
		}

		return mongooseQuery;
	}

	async create(data: CreateCategoryPersistence): Promise<CategoryEntity> {
		try {
			const createdDoc = await Category.create(data);
			return CategoryAdapter.toEntity(createdDoc);
		}
		catch (error: any) {
			if (error.code === 11000) {
				const keyPattern = error['keyPattern'];
				const key = Object.keys(keyPattern)[0] as keyof CreateCategoryPersistence;
				throw new EntityAlreadyExistsError("Category", { [key]: data[key] });
			}
			throw error;
		}
	}

	async updateById(id: string, data: UpdateCategoryPersistence): Promise<CategoryEntity> {
		const updatedDoc = await Category.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) throw new EntityNotFoundError("Category", { id });

		return CategoryAdapter.toEntity(updatedDoc);
	}

	async deleteById(id: string): Promise<CategoryEntity> {
		const deletedDoc = await Category.findByIdAndDelete(id).lean();

		if (!deletedDoc) throw new EntityNotFoundError("Category", { id });

		return CategoryAdapter.toEntity(deletedDoc);
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
		query: Record<string, any>,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<CategoryEntity>> {
		const mongooseQuery = this.#buildMongooseQuery(query);
		const sort = { name: 1 as const };

		const [foundDocs, total] = await Promise.all([
			Category.find(mongooseQuery)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean(),
			Category.countDocuments(mongooseQuery),
		]);

		const categoryEntities = foundDocs.map(doc => CategoryAdapter.toEntity(doc));
		return new RepositoryPaginationResult(categoryEntities, total);
	}

	async findByIds(ids: string[]): Promise<CategoryEntity[]> {
		const foundDocs = await Category.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => CategoryAdapter.toEntity(doc));
	}
}