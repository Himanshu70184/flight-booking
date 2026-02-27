import mongoose from 'mongoose';

const flightInquirySchema = new mongoose.Schema(
  {
    // Search Details
    tripType: {
      type: Number,
      enum: [0, 1, 2], // 0: OneWay, 1: RoundTrip, 2: MultiCity
      required: true,
    },
    origin: {
      type: String,
      required: true,
      uppercase: true,
    },
    destination: {
      type: String,
      required: true,
      uppercase: true,
    },
    departDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    adults: {
      type: Number,
      min: 1,
      max: 9,
      default: 1,
    },
    children: {
      type: Number,
      min: 0,
      max: 9,
      default: 0,
    },
    infants: {
      type: Number,
      min: 0,
      max: 2,
      default: 0,
    },
    cabin: {
      type: Number,
      enum: [0, 1, 2, 4], // 0: Economy, 1: First, 2: Business, 4: PremiumEconomy
      default: 0,
    },

    // Passenger Info
    passengerName: {
      type: String,
      required: true,
    },
    passengerEmail: {
      type: String,
      required: true,
    },
    passengerPhone: {
      type: String,
      required: true,
    },

    // Flight Results
    journeyId: {
      type: String,
    },
    segmentId: {
      type: String,
    },
    selectedFlight: {
      airlineName: String,
      departureTime: Date,
      arrivalTime: Date,
      flightNumber: String,
      price: Number,
      details: {},
    },

    // Inquiry Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'booked'],
      default: 'pending',
    },

    // Broker/Admin Notes
    brokerNotes: {
      type: String,
    },
    brokerAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
    },

    // Additional Info
    traceId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common searches
flightInquirySchema.index({ status: 1, createdAt: -1 });
flightInquirySchema.index({ passengerEmail: 1 });
flightInquirySchema.index({ brokerAssigned: 1 });

export const FlightInquiry = mongoose.model('FlightInquiry', flightInquirySchema);
