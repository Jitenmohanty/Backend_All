import { Router } from "express";
import { changeCurrentUserPassword, getCurrentUser, getUserChanelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserCoverImage, updateUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.midileware.js";
import { verifyJwt } from "../middlewares/auth.middileware.js";


const router = Router();

router.route('/register').post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }
]),registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt,logoutUser)
router.route('/refresh-accessToken').post(refreshAccessToken)
router.route('/change-password').post(verifyJwt,changeCurrentUserPassword)
router.route('/current-user').get(verifyJwt,getCurrentUser)
router.route('/update-profile').patch(verifyJwt,updateUserDetails)
router.route('/avatar').patch(verifyJwt,upload.single("avatar"),updateUserAvatar)
router.route('/cover-image').patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route('/c/:username').get(verifyJwt,getUserChanelProfile)
router.route('/watch-history').get(verifyJwt,getWatchHistory)


export default router;