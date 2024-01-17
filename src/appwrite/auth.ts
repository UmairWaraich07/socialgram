import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
import userService from "./user";
import { loginUserTypes, registerUserTypes } from "../types/index";

class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async registerUser({
    email,
    password,
    username,
    fullname,
  }: registerUserTypes) {
    try {
      const registeredUser = await this.account.create(
        ID.unique(),
        email,
        password,
        username
      );

      if (registeredUser) {
        // create an entry of user in database
        return await userService.createUser({
          fullname,
          username,
          email,
          id: registeredUser.$id,
        });
      } else {
        return registeredUser;
      }
    } catch (error) {
      console.log(`Error on registering user :: APPWRITE :: ${error}`);
      if (error instanceof Error) {
        // e is narrowed to Error!
        throw new Error(error.message);
      }
    }
  }

  async loginUser({ email, password }: loginUserTypes) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.log(`Error on logging the user :: APPWRITE :: ${error}`);
      if (error instanceof Error) {
        // e is narrowed to Error!
        throw new Error(error.message);
      }
    }
  }

  async logoutUser() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.log(`Error on logging out the user :: APPWRITE :: ${error}`);
      if (error instanceof Error) {
        // e is narrowed to Error!
        throw new Error(error.message);
      }
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log(
        `Error on getting the current logged in user :: APPWRITE :: ${error}`
      );
      if (error instanceof Error) {
        // e is narrowed to Error!
        throw new Error(error.message);
      }
    }
  }
}

const authService = new AuthService();
export default authService;
