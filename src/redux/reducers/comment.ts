import type { CommentData, Error } from "../../types";
import { createSlice, AnyAction } from "@reduxjs/toolkit";
import {
  getComments,
  createComment,
  deleteComment,
  likesComment,
} from "../thunks/comment";
import getNextCursor from "../../utils/getNextCursor";

function isPendingAction(action: AnyAction) {
  return /^comment\/.*\/pending$/.test(action.type);
}
function isFulfilledAction(action: AnyAction) {
  return /^comment\/.*\/fulfilled$/.test(action.type);
}
function isRejectedAction(action: AnyAction) {
  return /^comment\/.*\/rejected$/.test(action.type);
}

interface CommentState {
  loading: boolean;
  error: Error | null;
  comments: CommentData[];
  cursor: string;
  hasNext: boolean;
}

const initialState: CommentState = {
  loading: false,
  error: null,
  comments: [],
  cursor: "",
  hasNext: false,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    initComment: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.fulfilled, (state, action) => {
        const { comments, hasNext } = action.payload;
        const { cursor } = action.meta.arg;
        if (cursor) {
          state.comments.push(...comments);
        } else {
          state.comments = comments;
        }
        state.hasNext = hasNext;
        state.cursor = getNextCursor(comments);
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(likesComment.fulfilled, ({ comments }, action) => {
        const { commentId } = action.meta.arg;
        const index = comments.findIndex(
          (comment) => comment._id === commentId
        );
        comments[index].likeUsers = action.payload;
      })
      .addMatcher(isPendingAction, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilledAction, (state) => {
        state.loading = false;
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { initComment } = commentSlice.actions;

export default commentSlice.reducer;
