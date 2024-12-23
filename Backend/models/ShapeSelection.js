  const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const shapeSchema = new Schema({
    type: {
      type: String,
      required: true,
      enum: ['rectangle', 'triangle', 'circle', 'square'],
    },
    svg: {
      type: String,
      required: true,
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  });

  const droppableAreaSchema = new Schema({
    id: { type: String, required: true },
    shape: { type: shapeSchema, required: true },
  });

  const designSchema = new Schema({
    id: { type: String, required: true },
    color: { type: String, required: true },
    droppableAreas: [droppableAreaSchema],
  });

  const shapeSelectionSchema = new Schema({
    designs: [designSchema],
  });

  const ShapeSelection = mongoose.model('ShapeSelection', shapeSelectionSchema);

  module.exports = ShapeSelection;
