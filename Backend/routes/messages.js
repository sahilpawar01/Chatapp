const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', protect, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })
    .populate('sender', 'username')
    .populate('receiver', 'username')
    .sort({ createdAt: 1 });

  res.json(messages);
}));

// @route   POST /api/messages
// @desc    Create a new message
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { receiver, content } = req.body;

  if (!receiver || !content) {
    return res.status(400).json({ message: 'Please provide receiver and content' });
  }

  // Check if receiver exists
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    return res.status(404).json({ message: 'Receiver not found' });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    content,
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'username')
    .populate('receiver', 'username');

  res.status(201).json(populatedMessage);
}));

// @route   PUT /api/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:messageId/read', protect, asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  if (message.receiver.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  message.isRead = true;
  message.readAt = new Date();
  await message.save();

  res.json(message);
}));

module.exports = router;

