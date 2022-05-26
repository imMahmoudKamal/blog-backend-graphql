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

      // increment viewCount
      await Article.findByIdAndUpdate(article._id, { $inc: { viewCount: 1 } });

      return article;
    } catch (error) {
      return error;
    }
  }

  async getAllArticles(page, limit) {
    const options = {
      page: page || 1,
      limit: limit || 10,
      sort: {
        createdAt: -1,
      },
      customLabels: {
        docs: 'articles',
        totalDocs: 'totalArticles',
        limit: 'limit',
        totalPages: 'totalPages',
        page: 'currentPage',
        pagingCounter: 'pagingCounter',
        nextPage: 'next',
        prevPage: 'prev',
        meta: 'paginator',
      },
    };

    try {
      const allArticles = await Article.paginate({}, options);
      if (!allArticles) throw new Error('Internal Server Error Please try again later!');

      return allArticles;
    } catch (error) {
      return error;
    }
  }

  async getMostViewed(limit) {
    try {
      const mostViewed = await Article.find()
        .sort({ viewCount: -1 })
        .limit(limit || 5);

      if (!mostViewed) throw new Error('Internal Server Error Please try again later!');

      return mostViewed;
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
