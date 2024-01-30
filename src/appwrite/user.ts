import { Client, Databases, Query } from "appwrite";
import conf from "../conf/conf";
import { UpdateUserTypes, createUserTypes } from "../types/index";
import storageService from "./storage";

class UserService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createUser({ fullname, username, email, id }: createUserTypes) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        id,
        {
          fullname,
          username,
          email,
        }
      );
    } catch (error) {
      console.log(`Error on creating the user in DB :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getUser(accountId: string) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        accountId
      );
    } catch (error) {
      console.log(`Error on creating the user in DB :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getUserLikedPosts(userId: string) {
    try {
      const likedPosts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        [Query.equal("user", [userId]), Query.limit(10)]
      );
      if (!likedPosts) throw new Error("Failed to fetch liked Posts");
      return likedPosts.documents;
    } catch (error) {
      console.log(
        `Error on getting the user liked POSTS :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  async updateUserProfile({
    userId,
    fullname,
    username,
    bio,
    profilePicture,
  }: UpdateUserTypes) {
    try {
      console.log({ profilePicture });
      let file;
      // check if user has updated the profilePicture
      if (typeof profilePicture !== "string") {
        file = await storageService.uploadMedia(profilePicture[0]);
      }
      const updatedUser = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        userId,
        {
          fullname,
          username,
          bio,
          profilePicture: file ? file.$id : profilePicture,
        }
      );
      // if there is error in updating the user then delete the newly updated media
      if (!updatedUser) {
        if (file?.$id) {
          await storageService.deleteMedia(file?.$id);
        }
      }
      // delete the already stored profilePicture from storage
      if (file?.$id) {
        if (typeof profilePicture === "string") {
          await storageService.deleteMedia(profilePicture);
        }
      }
      return updatedUser;
    } catch (error) {
      console.log(`Error on updating the user :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }
}

const userService = new UserService();
export default userService;
