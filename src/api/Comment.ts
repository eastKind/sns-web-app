import axiosInstance from "./axios";
import type {
  GetCommentsResData,
  GetCommentsReqData,
  CreateCommentReqData,
  DeleteCommentReqData,
  LikesCommentReqData,
  CommentData,
} from "../types";

export default class Comment {
  public static async get({
    postId,
    cursor,
    limit,
  }: GetCommentsReqData): Promise<GetCommentsResData> {
    const query = `postId=${postId}&cursor=${cursor}&limit=${limit}`;
    const response = await axiosInstance.get(`/comment?${query}`);
    return response.data;
  }

  public static async create(
    reqData: CreateCommentReqData
  ): Promise<CommentData> {
    const response = await axiosInstance.post("/comment", reqData);
    return response.data.comment;
  }

  public static async delete({
    commentId,
    postId,
  }: DeleteCommentReqData): Promise<string> {
    const query = `postId=${postId}`;
    const response = await axiosInstance.delete(
      `/comment/${commentId}?${query}`
    );
    return response.data.id;
  }

  public static async likes({
    commentId,
    isLiked,
  }: LikesCommentReqData): Promise<string[]> {
    const response = await axiosInstance.patch(`/comment/${commentId}/like`, {
      isLiked,
    });
    return response.data.likeUsers;
  }
}
