import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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
      lowercase: true,
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    imageURL: {
      type: String,
      required: [true, 'imageURL field is required'],
    },
    imageDescription: {
      type: String,
      default: function () {
        return this.title;
      },
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

articleSchema.plugin(paginate);

articleSchema.pre('save', function (next) {
  this.permalink = this.permalink
    .replace(/[^\w\s-]/gi, '')
    .replace(/(\s+|-+)+/g, '-')
    .replace(/-$/, '');

  next();
});

export default mongoose.model('Article', articleSchema);
