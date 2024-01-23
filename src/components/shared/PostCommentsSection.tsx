import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Avatar, EditableComment } from ".";
import { Loader } from "../Icons";
import { timeAgoComments } from "@/lib/utils";

interface PostCommentsSectionProps {
  comments: Models.Document[] | undefined;
}
const PostCommentsSection = ({ comments }: PostCommentsSectionProps) => {
  return !comments ? (
    <div className="w-full h-full flex-center">
      <Loader />
    </div>
  ) : (
    <div className="w-full flex flex-col h-full max-xl:h-[320px] xl:max-h-[260px] overflow-y-auto custom-scrollbar">
      {comments?.length > 0 ? (
        <div className="flex flex-col gap-5">
          {comments.map((comment: Models.Document) => (
            <div key={comment.$id} className="flex gap-3">
              <Link to={`/profile/${comment.user.$id}`} className="w-[32px]">
                <Avatar
                  fullname={comment.user.fullname}
                  username={comment.user.username}
                  profilePicture={comment.user.profilePicture}
                  width={32}
                />
              </Link>
              <div className="flex flex-col w-full">
                <EditableComment comment={comment} />
                <div className="flex items-center gap-3">
                  <p className="tiny-medium lg:text-xs text-light-2/60">
                    {timeAgoComments(comment.$createdAt)}
                  </p>
                  {comment.isEdited && (
                    <p className="tiny-medium lg:text-xs text-light-2/70">
                      Edited
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-center h-full flex-col">
          <h3 className="text-[24px] font-medium ">No comments yet.</h3>
          <p className="small-medium text-light-2">Start the conversation</p>
        </div>
      )}
    </div>
  );
};

export default PostCommentsSection;
