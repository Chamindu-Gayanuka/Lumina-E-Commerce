import mongoose from 'mongoose';

export default function connectDB() {
    return mongoose.connect(process.env.MONGO_URL);
}
