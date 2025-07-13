const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/reviews.model");

exports.createRevService = async (userId, data) => {
    const rev = new reviewModel({ user: userId, ...data })
    const savedRev = await rev.save();
    return savedRev;
}

exports.getRevService = async (revId) => {
    const review = await reviewModel.findById(revId);
    return review;
}

exports.getReviews = async (q, page, limit) => {
    const { search, category, minPrice, maxPrice, rating, brand, sort } = q;

    const filters = {
        ...(search && {
            $or: [
                { productName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { review: { $regex: search, $options: 'i' } },
                { categories: { $regex: search, $options: 'i' } },
            ]
        }),
        ...(category && { categories: { $regex: category, $options: 'i' } }),
        ...((minPrice || maxPrice) &&
        {
            price: {
                ...(minPrice && { $gte: minPrice }),
                ...(maxPrice && { $lte : maxPrice})
            }
        }),
    ...(rating && {rating : {gte: rating}}),
    ...(brand && {brand : {$regex: brand , $options:'i'}})
    }

    let sortOptions = {createdAt : -1}
    if(sort === 'oldest') sortOptions = {createdAt : 1}

    const options = {
        page: page || 1,
        limit: limit || 10,
        sort: sortOptions
    }
    return await reviewModel.paginate(filters, options)
}

exports.updateReview = async (revId, updatedData, user) =>{
    const query = {
        _id: revId,
        $or:[
            {user:user.userId}
       ]
    }
    if(user.isAdmin){
        query.$or.push({});
    }
    const review = await reviewModel.findOneAndUpdate(query, {
        $set : updatedData
    },{
        new:true,
        runValidators: true
    })
    if(! review) throw new Error("unauthorized access !")
    return review;
}

exports.likeReview = async (revId, userId) =>{
    const rev = await reviewModel.findByIdAndUpdate(revId, {
        $addToSet :{likes: userId}
    },{
        new:true,
        runValidators:true
    })
    return rev;
}

exports.DislikeReview = async (revId, userId) => {
  const updatedRev = await reviewModel.findOneAndUpdate(
    {
      _id: revId,
      likes: new mongoose.Types.ObjectId(userId),
    },
    {
      $pull: { likes: new mongoose.Types.ObjectId(userId) },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRev) {
    throw new Error("You have not liked this review yet");
  }

  return updatedRev;
};



