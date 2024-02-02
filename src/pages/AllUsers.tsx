import { Loader } from "@/components/Icons";
import { UserCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllUsers, useSearchUsers } from "@/react-query/queries";
import { Models } from "appwrite";
import { useState } from "react";

interface SearchedUsersProps {
  searchedUsers: Models.DocumentList<Models.Document> | undefined;
  isSearching: boolean;
}
const SearchedUsersResult = ({
  searchedUsers,
  isSearching,
}: SearchedUsersProps) => {
  if (isSearching) {
    return (
      <div className="w-full flex-center grid-cols-1">
        <Loader width={40} height={40} />
      </div>
    );
  }

  if (searchedUsers && searchedUsers?.total > 0) {
    return (
      <ul className="user-grid w-full">
        {searchedUsers?.documents.map((user: Models.Document) => (
          <li key={user?.$id} className="flex-1 min-w-[200px] w-full ">
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-light-4 w-full text-center mt-10">No result found</p>
  );
};

const AllUsers = () => {
  const {
    data: users,
    isPending: isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAllUsers();
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search.trim(), 300);
  const shouldShowSearchResults = debouncedValue.trim() !== "";

  const { data: searchedUsers, isFetching: isSearching } =
    useSearchUsers(debouncedValue);
  const allUsers = users?.pages.flatMap((page) => page.documents);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <div className="w-full px-4 bg-dark-4 flex gap-1 rounded-lg ">
          <img src="/assets/icons/search.svg" />
          <Input
            type="text"
            placeholder="Search User"
            className="explore-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading && !users ? (
          <div className="w-full flex-center">
            <Loader width={40} height={40} />
          </div>
        ) : (
          <>
            {shouldShowSearchResults ? (
              <SearchedUsersResult
                searchedUsers={searchedUsers}
                isSearching={isSearching}
              />
            ) : (
              <ul className="user-grid w-full">
                {allUsers?.map((user: Models.Document) => (
                  <li key={user?.$id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={user} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="w-full flex-center">
          {!shouldShowSearchResults &&
            (isFetchingNextPage ? (
              <div className="w-full flex-center">
                <Loader />
              </div>
            ) : hasNextPage ? (
              <Button
                onClick={() => fetchNextPage()}
                className="shad-button_primary"
              >
                Load more users
              </Button>
            ) : (
              !isLoading && (
                <p className="text-light-3 mt-10 text-center w-full">
                  End of users
                </p>
              )
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
