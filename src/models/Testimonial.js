import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    customerPhoto: { type: String, default: '' },
    routeLabel: { type: String, default: '' },
    badge: { type: String, default: 'VERIFIED' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
