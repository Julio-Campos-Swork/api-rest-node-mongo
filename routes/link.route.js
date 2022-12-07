import { Router } from "express";
import {
  createLink,
  getLink,
  getLinks,
  removeLink,
  updateLink,
} from "../controllers/link.controller.js";
import { validateToken } from "../middlewares/validateToken.js";
import {
  linkValidator,
  paramLinkValidator,
} from "../middlewares/validatorManager.js";

const router = Router();

// GET      api/v1/links                all links
// GET      api/v1/links/:nanoLink      search link
// POST     api/v1/links                create link
// PATCH    api/v1/links                update link
// DELETE   api/v1/links/:nanoLink      remove link

router.get("/", validateToken, getLinks);
router.post("/", validateToken, linkValidator, createLink);
router.get("/:nanoLink",  getLink);
router.delete("/:id", validateToken, paramLinkValidator, removeLink);
router.patch("/:id", validateToken, paramLinkValidator, linkValidator, updateLink)
export default router;
