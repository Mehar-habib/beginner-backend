import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // Extract the username parameter from the request
  const { username } = req.params;

  // Check if the username is not provided or is empty after trimming
  if (!username?.trim()) {
    // Throw a 400 Bad Request error if username is missing
    throw new ApiError(400, "username is required");
  }

  // Perform an aggregation query on the User collection
  const channel = await User.aggregate([
    {
      // Match the user document with the provided username (case insensitive)
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      // Perform a lookup to join with the subscriptions collection for subscribers
      $lookup: {
        from: "subscriptions", // The collection to join
        localField: "_id", // Local field in the user collection
        foreignField: "channel", // Foreign field in the subscriptions collection
        as: "subscribers", // Output array field name
      },
    },
    {
      // Perform a lookup to join with the subscriptions collection for subscribed channels
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      // Add additional fields to the output documents
      $addFields: {
        // Count the number of subscribers
        subscribersCount: {
          $size: "$subscribers",
        },
        // Count the number of channels the user is subscribed to
        channelSubscribersToCount: {
          $size: "$subscribedTo",
        },
        // Check if the current user is subscribed to this channel
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      // Project (select) specific fields to include in the final output
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        channelSubscribersToCount: 1,
        isSubscribed: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  // If no channel is found, throw a 404 Not Found error
  if (!channel?.length) {
    throw new ApiError(404, "channel does not exist");
  }

  // Respond with the channel profile data and a success message
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "channel profile fetched successfully")
    );
});

export { getUserChannelProfile };
