import express from "express";
import { Verify } from "../../utils/user";

const api = express.Router();

api.post("/", Verify);

export default api;