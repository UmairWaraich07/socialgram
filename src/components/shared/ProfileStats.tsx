import { Models } from "appwrite";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ProfileUserCard } from ".";
import {
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/react-query/queries";
import { Loader } from "../Icons";
import { useState } from "react";

interface ProfileStatsProps {
  user: Models.Document | undefined;
  isFollowersDialog?: boolean;
  isFollowingDialong?: boolean;
  profileOwnerId: string | undefined;
}

const ProfileStats = ({ user, profileOwnerId }: ProfileStatsProps) => {
  // these two states are responsible to fetch data only when you clicked on follower or following
  const [isFollowerClicked, setisFollowerClicked] = useState(false);
  const [isFollowingClicked, setisFollowingClicked] = useState(false);

  const { data: followingList, isPending: isLoadingFollowing } =
    useGetUserFollowing(user?.following, user?.$id, isFollowingClicked);
  const { data: followersList, isPending: isLoadingFollowers } =
    useGetUserFollowers(user?.followers, user?.$id, isFollowerClicked);

  return (
    <div className="flex gap-8 items-center justify-center xl:justify-start flex-wrap z-20">
      {/* Followers Dialog */}
      <AlertDialog>
        <AlertDialogTrigger onClick={() => setisFollowerClicked(true)}>
          <div className="flex-center gap-2 cursor-pointer">
            <p className="small-semibold lg:body-bold text-primary-500 cursor-pointer">
              {user?.followers.length}
            </p>
            <p className="small-medium lg:base-medium text-light-2 cursor-pointer">
              Followers
            </p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-dark-3 p-0 pb-4 max-w-[450px] max-sm:w-[90%] rounded-xl border border-dark-4">
          <AlertDialogHeader className="relative">
            <AlertDialogTitle className="text-center w-full p-3 border-b-2 border-dark-4">
              Followers
            </AlertDialogTitle>
            <AlertDialogCancel
              className="absolute top-0 right-2 outline-none border-none p-0"
              onClick={() => setisFollowerClicked(false)}
            >
              <Cross1Icon width={24} height={24} className="font-bold" />
            </AlertDialogCancel>

            <AlertDialogDescription className="p-4 overflow-y-scroll custom-scrollbar">
              {isLoadingFollowers && !followersList ? (
                <div className="w-full flex-center">
                  <Loader />
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {followersList && followersList?.total > 0 ? (
                    followersList?.documents?.map((user: Models.Document) => (
                      <li key={user.$id}>
                        <ProfileUserCard
                          user={user}
                          isFollowersDialog={true}
                          profileOwnerId={profileOwnerId}
                        />
                      </li>
                    ))
                  ) : (
                    <p className="text-light-2 w-full">
                      {user?.fullname} has no followers yet.
                    </p>
                  )}
                </ul>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Following Dialog */}
      <AlertDialog>
        <AlertDialogTrigger onClick={() => setisFollowingClicked(true)}>
          <div className="flex-center gap-2 ">
            <p className="small-semibold lg:body-bold text-primary-500 cursor-pointer">
              {user?.following.length}
            </p>
            <p className="small-medium lg:base-medium text-light-2 cursor-pointer">
              Following
            </p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-dark-3 p-0 pb-4 max-w-[450px] max-sm:w-[90%] rounded-xl border border-dark-4">
          <AlertDialogHeader className="relative">
            <AlertDialogTitle className="text-center w-full p-3 border-b-2 border-dark-4">
              Following
            </AlertDialogTitle>
            <AlertDialogCancel
              className="absolute top-0 right-2 outline-none border-none p-0"
              onClick={() => setisFollowingClicked(false)}
            >
              <Cross1Icon width={24} height={24} className="font-bold" />
            </AlertDialogCancel>

            <AlertDialogDescription className="p-4 overflow-y-scroll custom-scrollbar">
              {isLoadingFollowing && !followingList ? (
                <div className="w-full flex-center">
                  <Loader />
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {followingList && followingList?.total > 0 ? (
                    followingList?.documents?.map((user: Models.Document) => (
                      <li key={user.$id}>
                        <ProfileUserCard
                          user={user}
                          isFollowingDialong={true}
                          profileOwnerId={profileOwnerId}
                        />
                      </li>
                    ))
                  ) : (
                    <p className="text-light-2 w-full">
                      {user?.fullname} has no following yet.
                    </p>
                  )}
                </ul>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileStats;
