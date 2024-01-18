import { Loader } from "@/components/Icons";
import { useGetRecentPosts } from "@/react-query/queries";

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
            <div>
              {posts?.documents.map((post) => (
                <p>{post.caption}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
