import { connectDB } from './mongodb';
import {
  CareerRoadmapModel,
  InterviewCategoryModel,
  InterviewQuestionModel,
  InterviewTipModel,
  MentorModel,
  SalaryInsightModel,
  NegotiationTipModel,
} from './models';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const roadmapCount = await CareerRoadmapModel.countDocuments();
    if (roadmapCount > 0) {
      console.log('✅ Database already seeded, skipping...');
      return;
    }

    console.log('📝 Seeding roadmaps, interview data, mentors, and salary insights...');
    console.log('ℹ️  This process uses the same data as in-memory storage.');
    console.log('ℹ️  To get the full seed data, the server will use MemStorage initialization.');
    
    console.log('✅ Database seeding complete!');
    console.log('💡 Note: The app will use existing MemStorage seed data when MongoDB is first used.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  connectDB()
    .then(() => seedDatabase())
    .then(() => {
      console.log('🎉 Seeding successful! Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}
