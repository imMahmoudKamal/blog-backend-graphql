import { DataSource } from 'apollo-datasource';
import Article from '../models/article.model.js';
import mongoose from 'mongoose';

export class articleDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async create(input) {
    try {
      // create new article
      const newArticle = await new Article({ ...input });

      // save article to db
      const savedArticle = await newArticle.save();
      if (!savedArticle) throw new Error('Error while saving Article please try again');

      return savedArticle;
    } catch (error) {
      return error;
    }
  }

  async getArticle(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const article = await Article.findOne({ $or: [{ _id }, { permalink: input }] });
      if (!article) throw new Error('Article is not exist!');

      return article;
    } catch (error) {
      return error;
    }
  }

  async getAllArticles() {
    try {
      const allArticles = await Article.find({});
      if (!allArticles) throw new Error('Internal Server Error Please try again later!');

      return allArticles;
    } catch (error) {
      return error;
    }
  }

  async update(id, input) {
    const _id = mongoose.isValidObjectId(id) ? id : null;

    try {
      // update post
      const updatedArticle = await Article.findOneAndUpdate({ $or: [{ _id }, { permalink: id }] }, { ...input });
      if (!updatedArticle) throw new Error('Article is not exist!');

      // get updated post
      const article = await Article.findById(updatedArticle._id);

      return article;
    } catch (error) {
      return error;
    }
  }

  async delete(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const deletedArticle = await Article.findOneAndDelete({ $or: [{ _id }, { permalink: input }] });
      if (!deletedArticle) throw new Error('Article is not exist!');

      return 'Article Deleted Successfully!';
    } catch (error) {
      return error;
    }
  }
}
