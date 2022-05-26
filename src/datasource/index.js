import { articleDataSource } from './article.js';
import { categoryDataSource } from './category.js';

export const dataSource = {
  article: new articleDataSource(),
  category: new categoryDataSource(),
};
