import storageService from "@/appwrite/storage";
import { Loader } from "@/components/Icons";
import {
  Avatar,
  PostComment,
  PostCommentsSection,
  PostStats,
  RelatedPosts,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { timeAgo } from "@/lib/utils";
import {
  useDeletePost,
  useGetPost,
  useGetPostComments,
  useGetUser,
} from "@/react-query/queries";
import { Models } from "appwrite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Post = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useGetPost(postId || "");
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
  } = useGetPostComments(post?.$id || "");
  const allComments = comments?.pages.flatMap((page) => page.documents);
  const { data: userInfo, isPending: isUserLoading } = useGetUser(
    post?.user.$id
  );
  const relatedPosts = userInfo?.posts.filter(
    (post: Models.Document) => post.$id !== postId
  );
  console.log({ relatedPosts });
  const { mutateAsync: deletePost } = useDeletePost();
  const { userData, setUserData } = useUserContext();

  const handleDeletePost = async () => {
    if (post) {
      const response = await deletePost({
        postId: post.$id,
        mediaId: post.media,
      });
      if (!response) {
        toast("Failed to delete this post. Please try again");
      } else {
        toast("Post deleted successfully");
        navigate(`/profile/${userData.id}`);
        const filteredSavedPosts = userData.savedPosts.filter(
          (post) => post.$id !== postId
        );
        setUserData({
          ...userData,
          savedPosts: filteredSavedPosts,
        });
      }
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium cursor-pointer">Back</p>
        </Button>
      </div>
      {isPending || !post ? (
        <div className="h-[400px] w-full flex-center">
          <Loader width={48} height={48} />
        </div>
      ) : (
        <div className="post_details-card">
          <img
            src={String(storageService.getMediaPreview(post.media))}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex items-center justify-between max-xs:flex-col-reverse w-full">
              <Link
                to={`/profile/${post?.user.$id}`}
                className="flex items-center gap-3 w-full"
              >
                <Avatar
                  fullname={post.user.fullname}
                  username={post.user.username}
                  profilePicture={post.user.profilePicture}
                  className="w-12 h-12 overflow-hidden"
                />

                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1 cursor-pointer">
                    {post?.user.fullname}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {timeAgo(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              {/* ONLY show the edit and delete button to the creator of this post */}
              {userData.id === post.user.$id && (
                <div className="flex items-center justify-center max-xs:w-full max-xs:justify-end gap-4">
                  <Link to={`/edit-post/${post?.$id}`}>
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>

                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className="post_details-delete_btn "
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              )}
            </div>

            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-2 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="w-full border border-dark-4/80" />
            {/* COMMENTS SECTION */}
            <PostCommentsSection
              comments={allComments}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />

            <hr className="border w-full border-dark-4/80" />

            <div className="w-full flex flex-col gap-5 lg:gap-4">
              <PostStats
                postId={post.$id}
                userId={userData.id}
                totalComments={comments?.pages.length}
              />
              <hr className="border w-full border-dark-4/80" />
              <PostComment
                postId={postId || ""}
                userId={userData.id}
                showNewComment={false}
              />
            </div>
          </div>
        </div>
      )}

      {relatedPosts?.length > 0 && (
        <div className="w-full max-w-5xl">
          <hr className="border w-full border-dark-4/80" />

          <h3 className="body-bold md:h3-bold w-full my-10">
            More Related Posts
          </h3>
          {isUserLoading || !relatedPosts ? (
            <Loader />
          ) : (
            <RelatedPosts posts={relatedPosts} user={post?.user} />
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
