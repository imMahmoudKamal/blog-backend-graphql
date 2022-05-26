import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function (next) {
  this.permalink = this.permalink
    .replace(/[^\w\s]/gi, '')
    .replace(/(\s+|-+)+/g, '-')
    .replace(/-$/, '');

  next();
});

export default mongoose.model('Category', categorySchema);
