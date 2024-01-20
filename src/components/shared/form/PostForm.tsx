import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postFormValidation } from "@/lib/validations";
import { FileUploader } from "..";
import storageService from "@/appwrite/storage";
import { useUserContext } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useCreatePost, useEditPost } from "@/react-query/queries";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";
import { parseTags } from "@/lib/utils";

interface PostFormProps {
  post?: Models.Document;
  action: "Create" | "Edit";
}
const PostForm = ({ post, action }: PostFormProps) => {
  const { userData } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();
  const { mutateAsync: editPost, isPending: isEditingPost } = useEditPost();

  const form = useForm<z.infer<typeof postFormValidation>>({
    resolver: zodResolver(postFormValidation),
    defaultValues: {
      caption: post?.caption ? post.caption : "",
      media: post?.media ? post.media : [],
      location: post?.location ? post.location : "",
      tags: post?.tags ? post.tags.join(", ") : "",
    },
  });

  async function create(values: z.infer<typeof postFormValidation>) {
    try {
      // convert the string of array to the array
      const tagsArray = parseTags(values.tags);
      if (post && action === "Edit") {
        // check if the user has changed the photo or not
        const isMediaChanged = typeof values.media === "string" ? false : true;
        // upload the new file to the appwrite bucket
        const file = isMediaChanged
          ? await storageService.uploadMedia(values.media[0])
          : post.media;
        if (file) {
          // if there is new photo then delete the already uploaded
          if (isMediaChanged) {
            const response = await storageService.deleteMedia(post.media);
            if (!response) throw new Error("Existed image deletion failed");
          }
          //  send the edited Post data to the server
          const editedPost = await editPost({
            postId: post.$id,
            caption: values.caption,
            location: values.location,
            media: isMediaChanged ? file.$id : post.media,
            tags: tagsArray,
          });
          if (editedPost) {
            toast("Post edited successfully.");
            navigate(`/post/${post.$id}`, { replace: true });
          } else {
            // delete the file from appwrite storage
            await storageService.deleteMedia(file.$id);
            toast("Post updation failed. Pleas try again.");
          }
        }
      } else {
        // upload the file to the storage
        const file = await storageService.uploadMedia(values.media[0]);

        if (file) {
          // send a request to the server with the new data
          const newPost = await createPost({
            user: userData.id,
            caption: values.caption,
            location: values.location,
            media: file.$id,
            tags: tagsArray,
          });
          if (newPost) {
            toast("Post created successfully.");
            navigate("/", { replace: true });
          } else {
            // delete the file from appwrite storage
            await storageService.deleteMedia(file.$id);
            toast("Post creation failed. Pleas try again.");
          }
        }
      }
    } catch (error) {
      console.log(`Error while creating the post :: ${error}`);
      throw new Error((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(create)}
        className="w-full flex flex-col gap-9 max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.media}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (Separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Js, React.js, Next.js"
                  className="shad-input"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isCreatingPost || isEditingPost}
          >
            {isCreatingPost || isEditingPost ? (
              <div className="flex-center gap-2">
                <ReloadIcon className="animate-spin" />
                <p>{isCreatingPost ? "Creating" : "Editing"} Post...</p>
              </div>
            ) : (
              <p className="cursor-pointer">{action} Post</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
