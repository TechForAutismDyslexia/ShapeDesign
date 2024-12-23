const mongoose = require('mongoose');

const designCompletionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  timeSpent: {
    type: Number, 
    required: true,
  },
  designNames: {
    type: [String], 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DesignCompletion = mongoose.model('DesignCompletion', designCompletionSchema);

module.exports = DesignCompletion;
