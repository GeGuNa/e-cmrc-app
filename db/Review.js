const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productImage: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.authorEmail; 
    }
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  authorEmail: {
    type: String,
    required: [true, 'Author email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  authorAvatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=1'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    minlength: [20, 'Content must be at least 20 characters'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each pro cannot exceed 100 characters']
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each con cannot exceed 100 characters']
  }],
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  photos: [{
    url: String,
    publicId: String,
    uploadedAt: Date
  }],
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative']
  },
  helpfulVotes: [{
    userId: mongoose.Schema.Types.ObjectId,
    voteType: {
      type: String,
      enum: ['helpful', 'notHelpful']
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNotes: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  ipAddress: String,
  userAgent: String,
  isGuestReview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ authorEmail: 1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true, sparse: true });


reviewSchema.pre('save', async function(next) {

  if (this.isNew || this.isModified('rating') || this.isModified('status')) {
    const Product = mongoose.model('Product');
    await Product.calculateAverageRating(this.productId);
  }
  next();
});

ng
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  await Product.calculateAverageRating(this.productId);
});


reviewSchema.methods.hasUserVoted = function(userId) {
  return this.helpfulVotes.some(vote => vote.userId.toString() === userId.toString());
};


reviewSchema.methods.addVote = async function(userId, voteType) {
  const existingVote = this.helpfulVotes.find(
    vote => vote.userId.toString() === userId.toString()
  );
  
  if (existingVote) {
    if (existingVote.voteType === voteType) {
    
      this.helpfulVotes = this.helpfulVotes.filter(
        vote => vote.userId.toString() !== userId.toString()
      );
      if (voteType === 'helpful') this.helpful = Math.max(0, this.helpful - 1);
      else this.notHelpful = Math.max(0, this.notHelpful - 1);
    } else {
   
      existingVote.voteType = voteType;
      existingVote.votedAt = Date.now();
      if (voteType === 'helpful') {
        this.helpful += 1;
        this.notHelpful = Math.max(0, this.notHelpful - 1);
      } else {
        this.notHelpful += 1;
        this.helpful = Math.max(0, this.helpful - 1);
      }
    }
  } else {
   
    this.helpfulVotes.push({ userId, voteType, votedAt: Date.now() });
    if (voteType === 'helpful') this.helpful += 1;
    else this.notHelpful += 1;
  }
  
  await this.save();
};


reviewSchema.statics.checkDuplicateReview = async function(productId, userId, authorEmail) {
  const query = { productId, status: { $ne: 'rejected' } };
  
  if (userId) {
    query.userId = userId;
  } else if (authorEmail) {
    query.authorEmail = authorEmail;
  }
  
  return await this.findOne(query);
};


reviewSchema.statics.getReviewStats = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { 
        productId: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  stats.forEach(stat => {
    distribution[stat._id] = stat.count;
  });

  const totalReviews = await this.countDocuments({
    productId: new mongoose.Types.ObjectId(productId),
    status: 'approved'
  });

  const averageRating = await this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$rating' }
      }
    }
  ]);

  const recommendCount = await this.countDocuments({
    productId: new mongoose.Types.ObjectId(productId),
    status: 'approved',
    wouldRecommend: true
  });

  return {
    distribution,
    totalReviews,
    averageRating: averageRating[0]?.avg?.toFixed(1) || 0,
    recommendPercentage: totalReviews > 0 
      ? Math.round((recommendCount / totalReviews) * 100) 
      : 0
  };
};

module.exports = mongoose.model('Review', reviewSchema);
