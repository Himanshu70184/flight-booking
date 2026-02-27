import { Router } from 'express';
import { FlightInquiry } from '../models/FlightInquiry.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/inquiries
 * Create a new flight inquiry (Public endpoint)
 */
router.post('/', async (req, res) => {
  try {
    const {
      tripType,
      origin,
      destination,
      departDate,
      returnDate,
      adults,
      children,
      infants,
      cabin,
      passengerName,
      passengerEmail,
      passengerPhone,
      journeyId,
      segmentId,
      selectedFlight,
      traceId,
    } = req.body;

    // Validation
    if (!origin || !destination || !departDate || !passengerName || !passengerEmail || !passengerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const inquiry = new FlightInquiry({
      tripType: tripType || 0,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departDate: new Date(departDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      adults: adults || 1,
      children: children || 0,
      infants: infants || 0,
      cabin: cabin || 0,
      passengerName,
      passengerEmail: passengerEmail.toLowerCase(),
      passengerPhone,
      journeyId,
      segmentId,
      selectedFlight,
      traceId,
      status: 'pending',
    });

    const savedInquiry = await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Flight inquiry created successfully',
      data: savedInquiry,
    });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create flight inquiry',
      message: error.message,
    });
  }
});

/**
 * GET /api/inquiries/:id
 * Get a specific inquiry
 */
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await FlightInquiry.findById(req.params.id).populate('brokerAssigned', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error('Get Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiry',
      message: error.message,
    });
  }
});

/**
 * GET /api/inquiries (Admin only)
 * Get all inquiries with filtering
 */
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, brokerAssigned, sortBy = '-createdAt', limit = 50, page = 1 } = req.query;

    const filter = { isActive: true };

    if (status) {
      filter.status = status;
    }

    if (brokerAssigned) {
      filter.brokerAssigned = brokerAssigned;
    }

    const skip = (page - 1) * limit;

    const inquiries = await FlightInquiry.find(filter)
      .populate('brokerAssigned', 'name email')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await FlightInquiry.countDocuments(filter);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiries',
      message: error.message,
    });
  }
});

/**
 * PUT /api/inquiries/:id (Admin only)
 * Update inquiry status and broker assignment
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status, brokerNotes, brokerAssigned } = req.body;

    const updateData = {};

    if (status && ['pending', 'approved', 'rejected', 'booked'].includes(status)) {
      updateData.status = status;
    }

    if (brokerNotes !== undefined) {
      updateData.brokerNotes = brokerNotes;
    }

    if (brokerAssigned !== undefined) {
      updateData.brokerAssigned = brokerAssigned || null;
    }

    const updatedInquiry = await FlightInquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('brokerAssigned', 'name email');

    if (!updatedInquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: updatedInquiry,
    });
  } catch (error) {
    console.error('Update Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inquiry',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/inquiries/:id (Admin only)
 * Soft delete an inquiry
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updatedInquiry = await FlightInquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete inquiry',
      message: error.message,
    });
  }
});

export default router;
