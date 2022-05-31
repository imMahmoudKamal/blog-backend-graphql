import { articleDataSource } from "./article.js";
import { categoryDataSource } from "./category.js";
import { userDataSource } from "./user.js";

export const dataSource = {
  article: new articleDataSource(),
  category: new categoryDataSource(),
  user: new userDataSource(),
};
