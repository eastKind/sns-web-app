import {
  createSlice,
  createAsyncThunk,
  SerializedError,
  AnyAction,
} from "@reduxjs/toolkit";
import Comment from "../api/Comment";
import { CommentData, GetCommentsQuery, CommentReqData } from "../types";

export const getComments = createAsyncThunk(
  "comment/get",
  async ({ id, cursor, limit }: GetCommentsQuery, { dispatch }) => {
    const { comments, hasNext } = await Comment.get({ id, cursor, limit });
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1]._id : "";
    dispatch(setCursor(nextCursor));
    dispatch(setHasNext(hasNext));
    return comments;
  }
);
export const createComment = createAsyncThunk(
  "comment/create",
  async (arg: CommentReqData) => {
    return await Comment.create(arg);
  }
);
export const updateComment = createAsyncThunk(
  "comment/update",
  async (arg: CommentReqData) => {
    return await Comment.update(arg);
  }
);
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (id: string) => {
    return await Comment.delete(id);
  }
);

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
  error: SerializedError | null;
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
    setCursor: (state, action) => {
      state.cursor = action.payload;
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.fulfilled, (state, action) => {
        const { cursor } = action.meta.arg;
        if (cursor) {
          state.comments.push(...action.payload);
        } else {
          state.comments = action.payload;
        }
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(
        updateComment.fulfilled,
        (state, { payload: updatedComment }) => {
          const index = state.comments.findIndex(
            (comment) => comment._id === updatedComment._id
          );
          state.comments.splice(index, 1, updatedComment);
        }
      )
      .addCase(deleteComment.fulfilled, (state, { payload: deletedPostId }) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== deletedPostId
        );
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
        state.error = action.error;
      });
  },
});

export const { setCursor, setHasNext } = commentSlice.actions;

export default commentSlice.reducer;