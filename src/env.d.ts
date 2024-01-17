/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_URL: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_BUCKET_ID: string;
  readonly VITE_APPWRITE_COMMENTS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_LIKES_COLLECTION_ID: string;
  readonly VITE_APPWRITE_POSTS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_TAGS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_USERS_COLLECTION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
