import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully');
    console.log('📝 Database:', mongoose.connection.db?.databaseName || 'Unknown');
    console.log('💡 User data (profiles, job applications, resumes, etc.) will be stored persistently in MongoDB.');
    console.log('💡 Static data (roadmaps, interview questions, mentors, salary insights) will use in-memory fallback if not seeded.');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}
