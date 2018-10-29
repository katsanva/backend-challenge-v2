import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      surname: String,
      email: String,
    },
    phones: [String],
    total: String,
  },
  {
    timestamps: true,
  },
);

export interface IOrderDTO {
  _id?: string;
  customer?: {
    name?: string;
    surname?: string;
    email?: string;
  };
  phones?: string[];
  total?: string;
  __v?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default mongoose.model('Order', OrderSchema);
