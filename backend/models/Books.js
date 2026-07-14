
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  
  {
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    bookImage: {
      url: {
          type: String,
          default: ""
      },
      public_id: {
          type: String,
          default: ""
      }
  },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    price: {
      type: Number,
      required: true,
  },
    availability: {
      type: Boolean,
      default: true,
    },
  
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
},
  {
    timestamps: true,
  }
);
bookSchema.index({
  pickupLocation: "2dsphere",
});

module.exports = mongoose.model("Book", bookSchema);