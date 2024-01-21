import config from "@/conf/conf";
import {
  CommentPostTypes,
  CreatePostTypes,
  EditCommentTypes,
  EditPostTypes,
  LikePostTypes,
  SavePostTypes,
} from "@/types";
import { Client, Databases, ID, Query } from "appwrite";

class ConfigService {
  client = new Client();
  databases;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async getPost(postId: string) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId
      );
    } catch (error) {
      console.log(`Error on getting the post data :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async createPost({ user, caption, media, location, tags }: CreatePostTypes) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        ID.unique(),
        {
          user,
          caption,
          media,
          location,
          tags,
        }
      );
    } catch (error) {
      console.log(`Error on creating the post :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async editPost({ postId, caption, media, location, tags }: EditPostTypes) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId,
        {
          caption,
          media,
          location,
          tags,
        }
      );
    } catch (error) {
      console.log(`Error on editing the post data :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async deletePost(postId: string) {
    try {
      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId
      );
      if (response) return true;
      return false;
    } catch (error) {
      console.log(`Error on deleting the post :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getRecentPosts() {
    try {
      const recentPosts = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
      if (!recentPosts) throw new Error("Failed to get Recent Posts");
      return recentPosts;
    } catch (error) {
      console.log(`Error on getting the recent posts :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  // ** POST LIKES ** //
  async getLikes(postId: string) {
    try {
      const likes = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("post", postId)]
      );
      if (likes) {
        return likes;
      } else {
        throw new Error("Failed to get post likes!");
      }
    } catch (error) {
      console.log(`Error on getting the post Likes :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async addLike({ postId, userId }: LikePostTypes) {
    try {
      const addedLike = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
      );
      if (!addedLike) return false;
      return true;
    } catch (error) {
      console.log(
        `Error on adding the like to the POST :: APPWRITE :: ${error}`
      );
      return false;
    }
  }
  async deleteLike(deleteRecordId: string) {
    try {
      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        deleteRecordId
      );
      if (!response) return false;
      return true;
    } catch (error) {
      console.log(
        `Error on deleting the like of the POST :: APPWRITE :: ${error}`
      );
      return false;
    }
  }

  async addToSaved({ userId, postId, savedPosts }: SavePostTypes) {
    try {
      if (savedPosts) {
        const session = await this.databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteUsersCollectionId,
          userId,
          {
            savedPosts: [...savedPosts, postId],
          }
        );
        if (!session) return false;
        return session.savedPosts;
      } else {
        return false;
      }
    } catch (error) {
      console.log(
        `Error on adding the post to the saved :: APPWRITE :: ${error}`
      );
      return false;
    }
  }

  async removeFromSaved({ userId, postId, savedPosts }: SavePostTypes) {
    try {
      if (savedPosts) {
        // remove the post from given savedPosts
        const filteredSavedPosts = savedPosts.filter(
          (post) => post.$id !== postId
        );
        // send the updated savedPosts to the server
        const session = await this.databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteUsersCollectionId,
          userId,
          {
            savedPosts: filteredSavedPosts,
          }
        );
        console.log({ session });
        if (!session) return false;
        return session.savedPosts;
      } else {
        return false;
      }
    } catch (error) {
      console.log(
        `Error on adding the post to the saved :: APPWRITE :: ${error}`
      );
      return false;
    }
  }

  // ** COMMENTS ** //
  async getPostComments(postId: string) {
    try {
      const comments = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        [
          Query.equal("post", postId),
          Query.orderDesc("$createdAt"),
          Query.limit(10),
        ]
      );
      if (!comments) throw new Error("Failed to fetch comments of this POST!");
      return comments;
    } catch (error) {
      console.log(`Error on getting the post comment :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async addComment({ text, postId, userId }: CommentPostTypes) {
    try {
      const newComment = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        ID.unique(),
        {
          text,
          post: postId,
          user: userId,
        }
      );
      if (!newComment) return {};
      return newComment;
    } catch (error) {
      console.log(
        `Error on adding the comment to the POST :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }
  async deleteComment(commentId: string) {
    try {
      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        commentId
      );
      if (!response) return false;
      return true;
    } catch (error) {
      console.log(
        `Error on deleting the comment of the POST :: APPWRITE :: ${error}`
      );
      return false;
    }
  }

  async editComment({ commentId, text }: EditCommentTypes) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        commentId,
        {
          text,
        }
      );
      if (!response) return false;
      return true;
    } catch (error) {
      console.log(
        `Error on editing the comment of the POST :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }
}

const configService = new ConfigService();
export default configService;
