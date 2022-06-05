import { DataSource } from 'apollo-datasource';
import mongoose from 'mongoose';
import DataLoader from '../../node_modules/dataloader/index.js';
import Category from '../models/category.model.js';

export class categoryDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;

    this.loaders = {
      category: new DataLoader(async (categoryIDs) => {
        const categories = await Category.find({ _id: { $in: categoryIDs } });

        return Promise.all(categories);
      }),
    };
  }

  async create(input) {
    try {
      // check if category exists
      const isExists = await Category.findOne({ permalink: input.permalink });
      if (isExists) throw new ApolloError('Category already exists!', 'BAD_USER_INPUT');

      // create new category
      const newCategory = await new Category({ ...input });

      // save category to db
      const savedCategory = await newCategory.save();
      if (!savedCategory)
        throw new ApolloError('Error while saving Category please try again', 'INTERNAL_SERVER_ERROR');

      return savedCategory;
    } catch (error) {
      return error;
    }
  }

  async getCategory(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const category = await Category.findOne({ $or: [{ _id }, { permalink: input }] });
      if (!category) throw new ApolloError('Category is not exists!', 'BAD_USER_INPUT');

      return category;
    } catch (error) {
      return error;
    }
  }

  async getCategoryByID(id) {
    try {
      const categories = await this.loaders.category.load(id);

      return categories;
    } catch (error) {
      return error;
    }
  }

  async getAllCategories() {
    try {
      const allCategories = await Category.find();
      if (!allCategories)
        throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

      return allCategories;
    } catch (error) {
      return error;
    }
  }

  async update(id, input) {
    const _id = mongoose.isValidObjectId(id) ? id : null;

    try {
      // update post
      const updatedCategory = await Category.findOneAndUpdate({ $or: [{ _id }, { permalink: id }] }, { ...input });
      if (!updatedCategory) throw new ApolloError('Category is not exist!', 'BAD_USER_INPUT');

      // get updated post
      const category = await Category.findById(updatedCategory._id);

      return category;
    } catch (error) {
      return error;
    }
  }

  async delete(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const deletedCategory = await Category.findOneAndDelete({
        $or: [{ _id }, { permalink: input }],
      });
      if (!deletedCategory) throw new ApolloError('Category is not exist!', 'BAD_USER_INPUT');

      return 'Category Deleted Successfully!';
    } catch (error) {
      return error;
    }
  }
}
