import { Loader } from "@/components/Icons";
import { GridPostsList } from "@/components/shared";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/react-query/queries";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface SearchedPostsProps {
  posts: Models.DocumentList<Models.Document> | undefined;
  isSearching: boolean;
}

const SearchedPosts = ({ posts, isSearching }: SearchedPostsProps) => {
  if (isSearching) {
    return (
      <div className="w-full flex-center grid-cols-1">
        <Loader width={40} height={40} />
      </div>
    );
  }
  if (posts && posts?.total > 0) {
    return <GridPostsList posts={posts.documents} isExplorePage={true} />;
  }

  return (
    <p className="text-light-4 w-full text-center mt-10">No result found</p>
  );
};

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue.trim(), 300);
  const { data: searchedPosts, isFetching: isSearching } =
    useSearchPosts(debouncedValue);
  const shouldShowSearchResult = debouncedValue !== "";

  const { data: posts, hasNextPage, fetchNextPage } = useGetPosts();
  const allPosts = posts?.pages.flatMap((page) => page.documents);

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue, fetchNextPage]);
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-12 mb-7">
        <h3 className="body-bold md:h3-bold">
          {shouldShowSearchResult ? "Search Results" : "Popular Today"}
        </h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResult ? (
          <SearchedPosts posts={searchedPosts} isSearching={isSearching} />
        ) : (
          <GridPostsList posts={allPosts!} isExplorePage={true} />
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div className="w-full flex-center mt-6" ref={ref}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
