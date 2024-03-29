import { createAsyncThunk } from "@reduxjs/toolkit";
import Comment from "../../api/Comment";
import type {
  GetCommentsReqData,
  CreateCommentReqData,
  DeleteCommentReqData,
  LikesCommentReqData,
} from "../../types";

export const getComments = createAsyncThunk(
  "comment/get",
  async (reqData: GetCommentsReqData, { rejectWithValue }) => {
    try {
      return await Comment.get(reqData);
    } catch (error: any) {
      const { status, data } = error.response;
      return rejectWithValue({ status, data });
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/create",
  async (reqData: CreateCommentReqData, { rejectWithValue }) => {
    try {
      return await Comment.create(reqData);
    } catch (error: any) {
      const { status, data } = error.response;
      return rejectWithValue({ status, data });
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (reqData: DeleteCommentReqData, { rejectWithValue }) => {
    try {
      return await Comment.delete(reqData);
    } catch (error: any) {
      const { status, data } = error.response;
      return rejectWithValue({ status, data });
    }
  }
);

export const likesComment = createAsyncThunk(
  "comment/likes",
  async (reqData: LikesCommentReqData, { rejectWithValue }) => {
    try {
      return await Comment.likes(reqData);
    } catch (error: any) {
      const { status, data } = error.response;
      return rejectWithValue({ status, data });
    }
  }
);
