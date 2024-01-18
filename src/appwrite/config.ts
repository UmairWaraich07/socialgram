import config from "@/conf/conf";
import { CreatePostTypes, EditPostTypes } from "@/types";
import { Client, Databases, ID } from "appwrite";
import storageService from "./storage";

class ConfigService {
  client = new Client();
  databases;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async getPosts() {
    try {
      const posts = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId
      );
      if (posts) {
        return posts.documents[0];
      }
      return false;
    } catch (error) {
      console.log(`Error on getting all the posts :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
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
      // upload the file to the storage
      const file = await storageService.uploadMedia(media);
      if (file) {
        return await this.databases.createDocument(
          config.appwriteDatabaseId,
          config.appwritePostsCollectionId,
          ID.unique(),
          {
            user,
            caption,
            media: file.$id,
            location,
            tags,
          }
        );
      }
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
}

const configService = new ConfigService();
export default configService;
