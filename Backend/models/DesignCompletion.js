const mongoose = require('mongoose');

const DesignCompletionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  designNames: { type: [String], required: true },
  numberOfDesigns: { type: Number, required: true },
  timer: { type: Number, required: true },
  tries: { type: Number, required: true, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('DesignCompletion', DesignCompletionSchema);
