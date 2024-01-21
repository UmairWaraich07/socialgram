import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postCommentValidation } from "@/lib/validations";
import { useAddComment } from "@/react-query/queries";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PostCommentProps {
  postId: string;
  userId: string;
  showNewComment?: boolean;
}

const PostComment = ({
  postId,
  userId,
  showNewComment = true,
}: PostCommentProps) => {
  const [newComment, setNewComment] = useState({});
  const { mutateAsync: addComment, isPending: isAddingComment } =
    useAddComment();

  const form = useForm<z.infer<typeof postCommentValidation>>({
    resolver: zodResolver(postCommentValidation),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof postCommentValidation>) {
    const newComment = await addComment({
      postId,
      userId,
      text: values.comment,
    });
    if (Object.keys(newComment).length === 0) {
      toast("Failed to add comment");
    } else {
      toast("Comment added successfully!");
      setNewComment(newComment);
      form.reset();
    }
  }
  return (
    <div className="">
      {Object.keys(newComment).length > 0 && showNewComment && (
        <div className="flex items-center gap-3 ">
          <Link to={`/profile/${userId}`} className="font-medium">
            {newComment?.user.username}
          </Link>
          <Link
            to={`/post/${postId}`}
            className="text-sm line-clamp-1 text-light-2/80"
          >
            {newComment?.text}
          </Link>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-4 ">
                      <Input
                        className="flex-1 bg-transparent outline-none ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                      px-0 ring-offset-0 py-0"
                        placeholder="Add a comment..."
                        {...field}
                      />
                      {field.value && (
                        <Button
                          type="submit"
                          disabled={isAddingComment}
                          className="text-primary-500 outline-none border-none px-0 py-0 font-medium hover:text-light-1"
                        >
                          {isAddingComment ? "Posting..." : "Post"}
                        </Button>
                      )}
                    </div>
                  </FormControl>

                  <FormMessage className="text-red text-sm" />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
};

export default PostComment;
