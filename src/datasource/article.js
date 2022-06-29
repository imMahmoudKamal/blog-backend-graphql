import { DataSource } from 'apollo-datasource';
import Article from '../models/article.model.js';
import Category from '../models/category.model.js';
import mongoose from 'mongoose';
import { ApolloError } from 'apollo-server-errors';

const customLabels = {
  docs: 'articles',
  totalDocs: 'totalArticles',
  limit: 'limit',
  totalPages: 'totalPages',
  page: 'currentPage',
  pagingCounter: 'pagingCounter',
  nextPage: 'next',
  prevPage: 'prev',
  meta: 'paginator',
};

export class articleDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async create(input) {
    try {
      // check if article exists
      const isArticleExists = await Article.findOne({ permalink: input.permalink });
      if (isArticleExists) return new ApolloError('Article already exists!', 'BAD_USER_INPUT');

      // check if category exists
      if (!mongoose.Types.ObjectId.isValid(input.categoryId))
        return new ApolloError('Invalid category Id', 'BAD_USER_INPUT');

      const isCategoryExists = await Category.findById(input.categoryId);
      if (!isCategoryExists)
        return new ApolloError("You can't create an Article with a category that doesn't exists!", 'BAD_USER_INPUT');

      // create new article
      const newArticle = await new Article({ ...input });

      // save article to db
      const savedArticle = await newArticle.save();
      if (!savedArticle) return new ApolloError('Error while saving Article please try again', 'INTERNAL_SERVER_ERROR');

      return savedArticle;
    } catch (error) {
      return error;
    }
  }

  async getArticle(input) {
    const _id = mongoose.isValidObjectId(input) ? input : null;

    try {
      const article = await Article.findOne({ $or: [{ _id }, { permalink: input }] });
      if (!article) throw new ApolloError('Article is not exist!', 'BAD_USER_INPUT');

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
      customLabels,
    };

    try {
      const allArticles = await Article.paginate({}, options);
      if (!allArticles) throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

      return allArticles;
    } catch (error) {
      return error;
    }
  }

  async getAllArticlesByCategory(category, page, limit) {
    const options = {
      page: page || 1,
      limit: limit || 10,
      sort: {
        createdAt: -1,
      },
      customLabels,
    };

    try {
      const categoryId = mongoose.isValidObjectId(category)
        ? category
        : (await Category.findOne({ permalink: category }))?.id;

      const allArticles = await Article.paginate({ categoryId }, options);
      if (!allArticles) throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

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

      if (!mostViewed) throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

      return mostViewed;
    } catch (error) {
      return error;
    }
  }

  async getRecent(limit) {
    try {
      const recentArticles = await Article.find()
        .sort({ createdAt: -1 })
        .limit(limit || 5);

      if (!recentArticles)
        throw new ApolloError('Internal Server Error Please try again later!', 'INTERNAL_SERVER_ERROR');

      return recentArticles;
    } catch (error) {
      return error;
    }
  }

  async update(id, input) {
    const _id = mongoose.isValidObjectId(id) ? id : null;

    try {
      // update post
      const updatedArticle = await Article.findOneAndUpdate({ $or: [{ _id }, { permalink: id }] }, { ...input });
      if (!updatedArticle) throw new ApolloError('Article is not exist!', 'BAD_USER_INPUT');

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
      const deletedArticle = await Article.findOneAndDelete({
        $or: [{ _id }, { permalink: input }],
      });
      if (!deletedArticle) throw new ApolloError('Article is not exist!', 'BAD_USER_INPUT');

      return 'Article Deleted Successfully!';
    } catch (error) {
      return error;
    }
  }
}
