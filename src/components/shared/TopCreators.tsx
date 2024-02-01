import { useGetTopCreators } from "@/react-query/queries";
import { UserCard } from ".";
import { Loader } from "../Icons";

const TopCreators = () => {
  const {
    data: creators,
    isPending: isUserLoading,
    isError,
  } = useGetTopCreators();
  console.log({ creators });

  if (isError) {
    <div className="sticky right-0 top-0 home-creators border border-dark-4 h-screen">
      <p className="body-medium text-light-1">Something bad happened</p>
    </div>;
  }

  return (
    <div className="sticky right-0 top-0 home-creators border border-dark-4 h-screen">
      <h3 className="h3-bold text-light-1">Top Creators</h3>
      {isUserLoading && !creators ? (
        <div className="w-full flex-center">
          <Loader />
        </div>
      ) : (
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {creators?.documents.map((creator) => (
            <li key={creator.$id}>
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopCreators;
