import config from "@/conf/conf";
import { Client, Storage } from "appwrite";

class StorageService {
  client = new Client();
  storage;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.storage = new Storage(this.client);
  }
}

const storageService = new StorageService();
export default storageService;
