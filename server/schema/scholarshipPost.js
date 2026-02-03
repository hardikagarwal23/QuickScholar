import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  state: { type: String, required: true },
  amount: { type: String, required: true },
  award: { type: String, required: true },
  deadline: { type: String, required: true },
  description:{type:String,required:true},
  mingpa:{type:String,required:true},
  apply: { type: String, required: true }
}, { timestamps: true });

const posts = mongoose.model('Posts', postSchema, 'all_scholarships');

export default posts;
