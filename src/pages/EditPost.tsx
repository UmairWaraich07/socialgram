import { Loader } from "@/components/Icons";
import { PostForm } from "@/components/shared";
import { useGetPost } from "@/react-query/queries";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id: postId } = useParams();
  const { data: post, isPending } = useGetPost(postId!);

  return (
    <div className="w-full">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/public/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isPending ? <Loader /> : <PostForm action="Edit" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;
