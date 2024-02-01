import { Loader } from "@/components/Icons";
import { PostCard, TopCreators } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useGetRecentPosts } from "@/react-query/queries";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: posts,
    isPending: isLoadingPosts,
    isError: isErrorPosts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetRecentPosts();
  // convert the the posts into a single flatten array
  const allPosts = posts?.pages.flatMap((page) => page.documents);

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-1">
      <div className="common-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoadingPosts ? (
            <Loader width={48} height={48} />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {allPosts?.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {isFetchingNextPage ? (
          <div className="w-full flex-center">
            <Loader />
          </div>
        ) : hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            className="shad-button_primary"
          >
            Load more posts
          </Button>
        ) : (
          !isLoadingPosts && (
            <p className="text-light-3 mt-10 text-center w-full">
              End of posts
            </p>
          )
        )}
      </div>
      <TopCreators />
    </div>
  );
};

export default Home;
