const mongoose = require('mongoose');

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

locationSchema.pre('validate', function normalizeSlug(next) {
  if (this.name) {
    this.slug = toSlug(this.name);
  } else if (this.slug) {
    this.slug = toSlug(this.slug);
  }
  next();
});

module.exports = mongoose.model('Location', locationSchema);
