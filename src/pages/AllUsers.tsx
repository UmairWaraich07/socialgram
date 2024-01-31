import { Loader } from "@/components/Icons";
import { UserCard } from "@/components/shared";
import { useGetAllUsers } from "@/react-query/queries";
import { Models } from "appwrite";

const AllUsers = () => {
  const { data: users, isPending: isLoading } = useGetAllUsers();
  // console.log({ users });
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !users ? (
          <div className="w-full flex-center">
            <Loader width={40} height={40} />
          </div>
        ) : (
          <ul className="user-grid">
            {users?.documents.map((user: Models.Document) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
