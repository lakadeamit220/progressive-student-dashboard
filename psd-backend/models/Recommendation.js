import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    message: {
      type: String,
      default: 'Your mentor recommends you check out this course!',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
