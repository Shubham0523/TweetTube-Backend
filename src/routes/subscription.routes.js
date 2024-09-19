import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {checkUser} from '../middlewares/openRouteAuth.middleware.js';

const router = Router();

// http://localhost:3000/api/v1/subscription/...

router
  .route("/:channelId")
  .patch(verifyJWT, toggleSubscription)
  .get(checkUser, getUserChannelSubscribers);

router.route("/users/:subscriberId").get(checkUser, getSubscribedChannels);

export default router;