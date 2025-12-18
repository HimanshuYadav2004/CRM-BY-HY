import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "user", "manager"],
    default: "user"
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
},
{timestamps:true}
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, process.env.HASH_SALT);

});

userSchema.methods.comparePassword = async function (enteredPassowrd) {
  return bcrypt.compare(enteredPassowrd , this.password)
}

export default mongoose.model('User', userSchema);