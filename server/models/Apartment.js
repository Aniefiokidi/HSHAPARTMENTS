const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceNote: {
      type: String,
      default: 'per night',
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location is required'],
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    features: [{ type: String }],
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    maxGuests: { type: Number, default: 2 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Apartment', apartmentSchema);
