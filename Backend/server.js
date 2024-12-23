const express = require('express');
const mongoose = require('mongoose');
const DesignCompletion = require('./models/DesignCompletion');
const ShapeSelection = require('./models/ShapeSelection'); 
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/shapeDesign', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.post('/api/design-completion', async (req, res) => {
  try {
    const { userId, timeSpent, selectedDesignIds } = req.body;

    const designs = await ShapeSelection.find({ 'designs.id': { $in: selectedDesignIds } });
    
    const designNames = designs.map(design => design.designs
      .filter(d => selectedDesignIds.includes(d.id))
      .map(d => d.id)
    ).flat();

    const designCompletion = new DesignCompletion({
      userId,
      timeSpent,
      designNames,
    });

    await designCompletion.save();

    res.status(200).json({ message: 'Design completion data saved successfully!' });
  } catch (error) {
    console.error('Error saving design completion data:', error);
    res.status(500).json({ error: 'Failed to save design completion data' });
  }
});

app.get('/api/designs', async (req, res) => {
  try {
    const designs = await ShapeSelection.find();
    console.log(designs);
    res.status(200).json({
      message: 'Designs data fetched successfully',
      designs: designs,
    });
  } catch (error) {
    console.error('Error fetching designs data:', error);
    res.status(500).json({
      message: 'Failed to fetch designs data',
      error: error.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
