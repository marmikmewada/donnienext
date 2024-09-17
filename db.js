import mongoose from 'mongoose';

// Connection URI
const MONGO_URI = process.env.MONGODB_URI;

// Function to connect to the database
export async function connectToDatabase() {
  if (mongoose.connections[0].readyState === 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
}

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },
});

// Define the todo schema
const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  todo: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Export the models with different names
export const userTable = mongoose?.models?.User || mongoose.model('User', userSchema);
export const todoTable = mongoose?.models?.Todo || mongoose.model('Todo', todoSchema);
