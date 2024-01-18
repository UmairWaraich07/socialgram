import config from "@/conf/conf";
import { Client, ID, Storage } from "appwrite";

class StorageService {
  client = new Client();
  storage;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.storage = new Storage(this.client);
  }

  async uploadMedia(file: File) {
    try {
      return await this.storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log(
        `Error on uploading the media to storage :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  async deleteMedia(fileId: string) {
    try {
      return await this.storage.deleteFile(config.appwriteBucketId, fileId);
    } catch (error) {
      console.log(
        `Error on deleting the media from storage :: APPWRITE :: ${error}`
      );
      throw new Error((error as Error).message);
    }
  }

  getMediaPreview(fileId: string) {
    try {
      return this.storage.getFilePreview(config.appwriteBucketId, fileId);
    } catch (error) {
      console.log(`Error on getting the media preview :: APPWRITE :: ${error}`);
      throw new Error((error as Error).message);
    }
  }
}

const storageService = new StorageService();
export default storageService;
