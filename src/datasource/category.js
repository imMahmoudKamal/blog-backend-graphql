import { DataSource } from 'apollo-datasource';
import mongoose from 'mongoose';
import Article from '../models/article.model.js';
import Category from '../models/category.model.js';

export class categoryDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async create(input) {
    try {
      // create new category
      const newCategory = await new Category({ ...input });

      // save category to db
      const savedCategory = await newCategory.save();
      if (!savedCategory) throw new Error('Error while saving Category please try again');

      return savedCategory;
    } catch (error) {
      return error;
    }
  }

  async getCategory(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const category = await Category.findOne({ $or: [{ _id }, { permalink: input }] });
      if (!category) throw new Error('Category is not exist!');

      return category;
    } catch (error) {
      return error;
    }
  }

  async getAllCategories() {
    try {
      const allCategories = await Category.find();
      if (!allCategories) throw new Error('Internal Server Error Please try again later!');

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
      if (!updatedCategory) throw new Error('Category is not exist!');

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
      const deletedCategory = await Category.findOneAndDelete({ $or: [{ _id }, { permalink: input }] });
      if (!deletedCategory) throw new Error('Category is not exist!');

      return 'Category Deleted Successfully!';
    } catch (error) {
      return error;
    }
  }
}
