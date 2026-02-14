import Category from "../../models/mongoose/Category.js";

import {ICategoryRepository} from "../../interfaces/repositories/ICategoryRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {ConflictError} from "../../errors/apiErrors.js";
import {EntityNotFoundError} from "../../errors/domainErrors.js";

import {sanitizeSearchTerm} from "../../utils/sanitize.js";

export class CategoryMongooseRepository extends ICategoryRepository {
	#buildMongooseQuery(query) {
		const mongooseQuery = {};

		if (query.search) {
			const sanitizedTerm = sanitizeSearchTerm(query.search);
			mongooseQuery.name = new RegExp(sanitizedTerm, "i");
		}

		return mongooseQuery;
	}

	async create(data) {
		try {
			const createdDoc = await Category.create(data);
			return MongooseAdapter.toCategoryEntity(createdDoc);
		}
		catch (error) {
			if (error.code === 11000) {
				const keyPattern = error['keyPattern'];

				const key = Object.keys(keyPattern)[0];
				throw new ConflictError(`A category with this ${key} already exists.`);
			}
			throw error;
		}
	}

	async updateById(id, data) {
		const updatedDoc = await Category.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) throw new EntityNotFoundError("Category", { id });

		return MongooseAdapter.toCategoryEntity(updatedDoc);
	}

	async deleteById(id) {
		const deletedDoc = await Category.findByIdAndDelete(id).lean();

		if (!deletedDoc) throw new EntityNotFoundError("Category", { id });

		return MongooseAdapter.toCategoryEntity(deletedDoc);
	}

	async findById(id) {
		const foundDoc = await Category.findById(id).lean();
		return MongooseAdapter.toCategoryEntity(foundDoc);
	}

	async findBySlug(slug) {
		const foundDoc = await Category.findOne({ slug }).lean();
		return MongooseAdapter.toCategoryEntity(foundDoc);
	}

	async findAndCount(query, skip, limit) {
		const mongooseQuery = this.#buildMongooseQuery(query);
		const sort = { name: 1 };

		const [foundDocs, total] = await Promise.all([
			Category.find(mongooseQuery)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean(),
			Category.countDocuments(mongooseQuery),
		]);

		// /** @type {CategoryEntity[]} */
		const categoryEntities = foundDocs.map(doc => MongooseAdapter.toCategoryEntity(doc));
		return new RepositoryPaginationResult(categoryEntities, total);
	}

	async findByIds(ids) {
		const foundDocs = await Category.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => MongooseAdapter.toCategoryEntity(doc));
	}
}