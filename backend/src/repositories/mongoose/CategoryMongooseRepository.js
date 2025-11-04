import Category from "../../models/mongoose/Category.js";

import {ICategoryRepository} from "../../interfaces/repositories/ICategoryRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {BadRequestError, ConflictError} from "../../errors/apiErrors.js";

export class CategoryMongooseRepository extends ICategoryRepository {
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
		const $set = data.toUpdateObject();

		if (Object.keys($set).length === 0) {
			throw new BadRequestError("Nothing to update");
		}

		const updateOptions = { new: true, runValidators: true };
		const updatedDoc = await Category.findByIdAndUpdate(
			id,
			{ $set },
			updateOptions
		).lean();

		return MongooseAdapter.toCategoryEntity(updatedDoc);
	}

	async deleteById(id) {
		const deletedDoc = await Category.findByIdAndDelete(id).lean();
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

	async findAll() {
		const foundDocs = await Category.find({}).sort({ name: 1 }).lean();
		return foundDocs.map(doc => MongooseAdapter.toCategoryEntity(doc));
	}

	async findAndCount(skip, limit) {
		const [foundDocs, total] = await Promise.all([
			Category.find({})
				.sort({ name: 1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Category.countDocuments({}),
		]);

		const categoryEntities = foundDocs.map(doc => MongooseAdapter.toCategoryEntity(doc));
		return new RepositoryPaginationResult(categoryEntities, total);
	}

	async existsBySlug(slug) {
		const exists = await Category.existsById({ slug });
		return !!exists;
	}
}