import { asyncHandler } from "../utils/asyncHandler.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully");
});

export { getCurrentUser };
