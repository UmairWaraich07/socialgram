import { Loader } from "@/components/Icons";
import { GridPostsList } from "@/components/shared";
import { useUserContext } from "@/contexts/UserContext";

const Saved = () => {
  const { userData } = useUserContext();
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!userData ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {userData?.savedPosts?.length === 0 ? (
            <p className="text-light-4">No saved posts</p>
          ) : (
            <GridPostsList posts={userData?.savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
