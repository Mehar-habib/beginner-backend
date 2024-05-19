import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Define the getWatchHistory function wrapped with asyncHandler to handle async errors
const getWatchHistory = asyncHandler(async (req, res) => {
  // Use Mongoose aggregation to find the user and their watch history
  const user = await User.aggregate([
    {
      // Match the user by their ID
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(req.user._id),
      },
    },
    {
      // Lookup the watchHistory field in the videos collection
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            // Nested lookup to get the video owner's details from the users collection
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  // Project only the necessary fields for the owner
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            // Add the first element of the owner array to the owner field
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  // Send the response with status 200 and the user's watch history
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetched successfully"
      )
    );
});

export { getWatchHistory };
