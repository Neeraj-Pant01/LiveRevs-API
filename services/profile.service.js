const userModel = require('../models/user.model')
const profileModel = require('../models/profile.model')
const createError = require('../utils/error')

exports.getProfile = async (userId) => {
    const profile = await userModel.findById(userId).populate('profile').lean({ virtuals: true })
    const { password, ...others } = profile;
    return others
}


exports.createProfile = async (userId, profileData) => {
    const newProfile = new profileModel({ ...profileData, userId })
    const savedProfile = await newProfile.save();
    return savedProfile
}

exports.updateProfile = async (userID, updatedProfileData) => {
    // console.log('profile',userID)
    // const updatedProfile = await profileModel.findOne({userId:userID})
    const updatedProfile = await profileModel.findOneAndUpdate({ userId: userID }, {
        $set: updatedProfileData
    }, {
        new: true,
        runValidators: true
    })
    return updatedProfile;
}

exports.deleteProfile = async (isAdmin, userID) => {
    if (!isAdmin) return next(createError('unauthorized access !'))
    await profileModel.findByIdAndDelete(userID)
    return { message: "profile deleted successfully !" }
}


exports.addSocialLinks = async (userID, socialLinks) => {
    // console.log(socialLinks)
    const updatedData = await profileModel.findOneAndUpdate({ userId: userID }, {
        $push: {
            socilaLinks: { $each: socialLinks.socialLinks }
        }
    }, {
        new: true,
        runValidators: true
    })
    return updatedData;
}

exports.addAffiliateLinks = async (userID, affiliateLinks) => {
    const updatedResp = await profileModel.findOneAndUpdate({ userId: userID }, {
        $push: { affiliateLinks: { $each: affiliateLinks.affiliateLinks } }
    }, {
        new: true,
        runValidators: true
    })
    return updatedResp
}

exports.followUser = async (currentUserId, userID) => {

    // Check that both users have a profile
    const [user, currentUser] = await Promise.all([
        profileModel.findOne({ userId: userID }),
        profileModel.findOne({ userId: currentUserId }),
    ]);

    if (!user || !currentUser) {
        throw new Error("Both users must have a profile to follow.");
    }

    // Proceed with following
    await Promise.all([
        profileModel.updateOne(
            { userId: userID },
            { $addToSet: { followers: currentUserId } }
        ),
        profileModel.updateOne(
            { userId: currentUserId },
            { $addToSet: { followings: userID } } // <- fix here: you're following userID, not yourself
        ),
    ]);

    return { message: "Followed!" };
};



exports.unfollowUser = async (currentUserId, userID) => {
    const [user, currentUser] = await Promise.all([
        profileModel.findOne({ userId: userID }),
        profileModel.findOne({ userId: currentUserId }),
    ]);

    if (!user || !currentUser) {
        throw new Error("Both users must have a profile to follow.");
    }
    await Promise.all([
        profileModel.updateOne(
            { userId: userID },
            { $pull: { followers: currentUserId } }
        ),
        profileModel.updateOne(
            { userId: currentUserId },
            { $pull: { followings: userID } } // <- fix here: you're following userID, not yourself
        ),
    ]);

    return { message: "unfollowed !" }
}

