import { Loader } from "@/components/Icons";
import { Avatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { useGetUser } from "@/react-query/queries";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

interface StatBlockProps {
  value: number | string;
  label: string;
}
const StatBlock = ({ value, label }: StatBlockProps) => {
  return (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
};
const Profile = () => {
  const { id: accountId } = useParams();
  const { data: user, isPending } = useGetUser(accountId || "");
  const { userData } = useUserContext();
  const { pathname } = useLocation();

  console.log({ user });

  return isPending && !user ? (
    <div className="w-full flex-center h-[300px]">
      <Loader width={48} />
    </div>
  ) : (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col items-center flex-1 gap-12">
          <Avatar
            fullname={user?.fullname}
            username={user?.username}
            profilePicture={user?.profilePicture}
            width={90}
            className="w-28 h-28 lg:h-32 lg:w-32"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {user?.fullname}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{user?.username}
              </p>
            </div>
            <div className="flex gap-8 mt-6 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user?.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-4 max-w-screen-sm">
              Building the snapgram....
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {userData.id === user?.$id ? (
            <div>
              <Link
                to={`/edit-profile/${user?.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg 
                `}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium cursor-pointer">
                  Edit Profile
                </p>
              </Link>
            </div>
          ) : (
            <Button type="button" className="shad-button_primary px-8">
              Follow
            </Button>
          )}
        </div>
      </div>
      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${accountId}`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${accountId}` && "!bg-dark-3"
          }`}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        {userData.id === user?.$id ? (
          <Link
            to={`/profile/${accountId}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${accountId}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        ) : (
          <button disabled className="profile-tab rounded-r-lg">
            <LockClosedIcon className="text-primary-500 w-5 h-5" />
            Liked Posts
          </button>
        )}
      </div>
      <Outlet context={[user, user?.posts]} />
    </div>
  );
};

export default Profile;
