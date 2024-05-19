import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controller/login.controller.js";
import { logoutUser } from "../controller/logOut.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controller/refreshAccessToken.controller.js";
import { changeCurrentPassword } from "../controller/changePassword.controller.js";
import { getCurrentUser } from "../controller/currentUser.controller.js";
import { updateAccountDetails } from "../controller/updateAccountDetails.controller.js";
import {
  updateUserAvatar,
  updateUserCoverImage,
} from "../controller/updateAvatarAndCoverImage.controller.js";
import { getUserChannelProfile } from "../controller/userChannelProfile.controller.js";
import { getWatchHistory } from "../controller/watchHistory.controller.js";
const router = Router();

router.route("/register").post(
  // file handling
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
