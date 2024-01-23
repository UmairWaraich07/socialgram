import * as z from "zod";
import {
  CheckIcon,
  Cross1Icon,
  Pencil2Icon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postCommentValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDeleteComment, useEditComment } from "@/react-query/queries";
import { useUserContext } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import { Models } from "appwrite";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface EditableCommentProps {
  comment: Models.Document;
}

const EditableComment = ({ comment }: EditableCommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useUserContext();
  const { mutateAsync: editComment, isPending: isEditingComment } =
    useEditComment();
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();

  const form = useForm<z.infer<typeof postCommentValidation>>({
    resolver: zodResolver(postCommentValidation),
    defaultValues: {
      comment: comment.text,
    },
  });

  async function edit(values: z.infer<typeof postCommentValidation>) {
    const response = await editComment({
      commentId: comment.$id,
      text: values.comment,
      postId: comment.post.$id,
    });
    if (!response) return toast("Action failed. Please try again");
    setIsEditing(false);
    toast("Successfully edited the comment!");
  }

  async function handleDeleteComment() {
    const response = await deleteComment({
      commentId: comment.$id,
      postId: comment.post.$id,
    });
    if (!response) return toast("Action failed. Please try again");
    toast("Successfully deleted the comment!");
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex gap-2 w-full">
        <Link to={`/profile/${comment.user.$id}`} className="font-medium">
          {comment.user.username}
        </Link>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(edit)} className="w-full">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 w-full">
                          <Input
                            className="flex-1 bg-transparent text-sm px-1 border border-primary-500 h-8 focus-visible:ring-1
                         focus-visible:ring-offset-1 ring-offset-light-3"
                            {...field}
                          />
                          {field.value &&
                            (isEditingComment ? (
                              <Button
                                disabled={isEditingComment || isDeletingComment}
                              >
                                <ReloadIcon className="text-primary-500 animate-spin" />
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={isEditingComment}
                                  type="submit"
                                >
                                  <CheckIcon className="text-primary-500 w-5 h-5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                >
                                  <Cross1Icon className="text-red" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </FormControl>

                      <FormMessage className="text-red text-sm" />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
        ) : (
          <p className="text-sm text-light-2">{comment.text}</p>
        )}
      </div>
      {!isEditing && comment.user.$id === userData.id && (
        <div className="flex items-center gap-2">
          <button onClick={() => setIsEditing(true)}>
            <Pencil2Icon className="text-primary-500" />
          </button>

          <button onClick={handleDeleteComment} disabled={isDeletingComment}>
            <TrashIcon className="text-red" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableComment;
