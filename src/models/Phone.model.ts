import mongoose from 'mongoose';

const PhoneSchema = new mongoose.Schema(
  {
    image: String,
    name: String,
    description: String,
    price: String,
  },
  {
    timestamps: true,
  },
);

export interface IPhoneDTO {
  _id?: string;
  image?: string;
  name?: string;
  description?: string;
  price?: string;
  __v?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default mongoose.model('Phone', PhoneSchema);
