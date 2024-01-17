import { Client, Databases } from "appwrite";
import conf from "../conf/conf";
import { createUserTypes } from "../types/index";

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
}

const userService = new UserService();
export default userService;
