import config from "@/conf/conf";
import { CreatePostTypes, EditPostTypes } from "@/types";
import { Client, Databases, ID } from "appwrite";

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
        config.appwritePostsCollectionId
      );
      console.log({ recentPosts });
      if (!recentPosts) throw new Error("Failed to get Recent Posts");
      return recentPosts;
    } catch (error) {
      console.log(`Error on getting the recent posts :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }
}

const configService = new ConfigService();
export default configService;
