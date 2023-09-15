import {Schema, model} from 'mongoose';
import {Cat} from '../../interfaces/Cat';

const catSchema = new Schema<Cat>({
  cat_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  weight: {
    type: Number,
    ref: 'Category',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  owner: {
    _id: {type: String},
    user_name: {type: String},
    email: {type: String}
  }
});

export default model<Cat>('Cat', catSchema);