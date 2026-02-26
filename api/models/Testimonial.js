import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
