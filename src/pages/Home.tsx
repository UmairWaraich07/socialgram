import { Loader } from "@/components/Icons";
import { PostCard } from "@/components/shared";
import { useGetRecentPosts } from "@/react-query/queries";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isLoadingPosts } = useGetRecentPosts();

  return (
    <div className="w-full">
      <div className="common-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoadingPosts ? (
            <Loader width={40} height={40} />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents?.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
