import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title field is required'],
      trim: true,
    },
    permalink: {
      type: String,
      required: [true, 'permalink field is required'],
      unique: true,
    },
    imageURL: {
      type: String,
      required: [true, 'imageURL field is required'],
    },
    content: {
      type: String,
    },

    categoryId: {
      type: String,
      required: [true, 'categoryId field is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId field is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Article', articleSchema);
