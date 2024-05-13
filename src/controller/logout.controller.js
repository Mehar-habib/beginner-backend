import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const logoutUser = asyncHandler(async (req, res) => {
  // remove cookies
  // remove refresh Token
});

export { logoutUser };
