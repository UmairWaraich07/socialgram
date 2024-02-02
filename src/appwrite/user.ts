import { Client, Databases, Query } from "appwrite";
import conf from "../conf/conf";
import {
  AddToFollowerListTypes,
  RemoveFollowerTypes,
  UpdateUserTypes,
  createUserTypes,
} from "../types/index";

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
      console.log(`Error on getting the user in DB :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getAllUsers(pageParam: string) {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(9)];
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        queries
      );
    } catch (error) {
      console.log(
        `Error on getting all the users from DB :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  async getUserLikedPosts(userId: string, pageParam: string) {
    const queries = [Query.equal("user", [userId]), Query.limit(9)];
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }
    try {
      const likedPosts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        queries
      );
      if (!likedPosts) throw new Error("Failed to fetch liked Posts");
      return likedPosts;
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

      const updatedUser = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        userId,
        {
          fullname,
          username,
          bio,
          profilePicture,
        }
      );

      return updatedUser;
    } catch (error) {
      console.log(`Error on updating the user :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getUserFollowers(followers: string[]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        [Query.equal("$id", followers.length > 0 ? followers : [""])]
      );
    } catch (error) {
      console.log(
        `Error on getting the user followers list :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }
  async getUserFollowing(following: string[]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        [Query.equal("$id", following.length > 0 ? following : [""])]
      );
    } catch (error) {
      console.log(
        `Error on getting the user following list :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  async addToFollowerList({
    userId,
    targetUserId,
    targetUserFollowersList,
    userFollowingList,
  }: AddToFollowerListTypes) {
    try {
      // add the userId in the followers list of targetUser
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        targetUserId,
        {
          followers: [...targetUserFollowersList, userId],
        }
      );
      if (response) {
        // add the targetUserId in the following list of user
        const res = await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          userId,
          {
            following: [...userFollowingList, targetUserId],
          }
        );
        if (!res) return false;
        return res;
      }
    } catch (error) {
      console.log(
        `Error on adding the user in followers list :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }
  async removeFromFollowerList({
    userId,
    targetUserId,
    targetUserFollowersList,
    userFollowingList,
  }: AddToFollowerListTypes) {
    try {
      const newFollowersList = targetUserFollowersList.filter(
        (follower) => follower !== userId
      );
      const newFollowingList = userFollowingList.filter(
        (user) => user !== targetUserId
      );

      // remove the userId from the followers list of targetUser
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        targetUserId,
        {
          followers: newFollowersList,
        }
      );
      if (response) {
        // remove the targetUserId from the following list of user
        const res = await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          userId,
          {
            following: newFollowingList,
          }
        );
        if (!res) return false;
        return res;
      }
    } catch (error) {
      console.log(
        `Error on removing the user from followers list :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  async searchUser(searchTerm: string) {
    try {
      const users = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        [Query.search("fullname", searchTerm)]
      );

      if (!users) throw new Error("Failed to search users");
      return users;
    } catch (error) {
      console.log(`Error on searching the user :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getTopCreators() {
    try {
      const creators = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        [Query.orderAsc("followers"), Query.limit(6)]
      );
      if (!creators) throw new Error("Failed to get top creators");
      return creators;
    } catch (error) {
      console.log(`Error on getting the top creators :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async removeFollower({
    userId,
    targetUserId,
    userFollowersList,
    targetUserFollowingList,
  }: RemoveFollowerTypes) {
    // console.log({ followingList });
    try {
      const newUserFollowersList = userFollowersList.filter(
        (follower) => follower !== targetUserId
      );
      const newTargetUserFollowingList = targetUserFollowingList.filter(
        (user) => user !== userId
      );
      // console.log({ newFollowingList });

      // remove the userId from targetUserFollowingList
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        targetUserId,
        {
          following: newTargetUserFollowingList,
        }
      );
      if (response) {
        // remove the targetUserId from userFollowersList
        const res = await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteUsersCollectionId,
          userId,
          {
            followers: newUserFollowersList,
          }
        );
        if (!res) throw new Error("Failed to remove from follower");
        return res;
      }
    } catch (error) {
      console.log(`Error on removing the follower :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  async getUserRelatedPosts(userId: string) {
    try {
      const user = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteUsersCollectionId,
        [Query.equal("$id", userId)]
      );
      return user.documents;
    } catch (error) {
      console.log(`Error on removing the follower :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }
}

const userService = new UserService();
export default userService;
