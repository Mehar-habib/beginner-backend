import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const PlayList = mongoose.model("PlayList", playlistSchema);
