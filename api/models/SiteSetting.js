import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

export const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
