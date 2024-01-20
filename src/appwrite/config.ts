import config from "@/conf/conf";
import {
  CreatePostTypes,
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

  async editPost({ postId, caption, media, location }: EditPostTypes) {
    try {
      await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId,
        {
          caption,
          media,
          location,
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

  async getLikes(postId: string) {
    try {
      const likes = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("post", postId)]
      );
      if (likes) {
        return likes.total;
      }
    } catch (error) {
      console.log(`Error on getting the post Likes :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }
  async checkLiked({ postId, userId }: LikePostTypes) {
    try {
      const isLiked = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("post", postId), Query.equal("user", userId)]
      );
      // console.log({ isLiked });
      if (isLiked.total > 0) {
        return isLiked.documents[0].$id;
      }
      return "";
    } catch (error) {
      console.log(
        `Error on checking the user Like to the POST :: APPWRITE :: ${error}`
      );
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
  async deleteLike({ postId, userId }: LikePostTypes) {
    try {
      const likedPostId = await this.checkLiked({ postId, userId });
      if (likedPostId) {
        const removedLike = await this.databases.deleteDocument(
          config.appwriteDatabaseId,
          config.appwriteLikesCollectionId,
          likedPostId
        );
        if (!removedLike) return false;
        return true;
      }
    } catch (error) {
      console.log(
        `Error on deleting the like of the POST :: APPWRITE :: ${error}`
      );
      return false;
    }
  }

  async addToSaved({ userId, postId, savedPosts }: SavePostTypes) {
    try {
      // const user = await userService.getUser(userId);
      // console.log(user.savedPosts);
      if (savedPosts) {
        const session = await this.databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteUsersCollectionId,
          userId,
          {
            savedPosts: [...savedPosts, postId],
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
}

const configService = new ConfigService();
export default configService;
