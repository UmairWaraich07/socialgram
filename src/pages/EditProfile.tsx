import { useUserContext } from "@/contexts/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { editProfileValidation } from "@/lib/validations";
import { useUpdateUserProfile } from "@/react-query/queries";
import { Textarea } from "@/components/ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ProfilePhotoUploader } from "@/components/shared";
import { toast } from "sonner";
import { useEffect } from "react";

const EditProfile = () => {
  const { id } = useParams();
  const { userData, setUserData } = useUserContext();
  const { mutateAsync: editProfile, isPending: isEditingProfile } =
    useUpdateUserProfile();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof editProfileValidation>>({
    resolver: zodResolver(editProfileValidation),
    defaultValues: {
      profilePicture: userData?.profilePicture ? userData.profilePicture : "",
      fullname: userData?.fullname ? userData.fullname : "",
      username: userData?.username ? userData.username : "",
      bio: userData?.bio ? userData.bio : "",
    },
  });
  useEffect(() => {
    form.setValue(
      "profilePicture",
      userData?.profilePicture ? userData.profilePicture : ""
    );
    form.setValue("fullname", userData?.fullname);
    form.setValue("username", userData?.username);
    form.setValue("bio", userData?.bio ? userData.bio : "");
  }, [userData, form]);

  async function onSubmit(values: z.infer<typeof editProfileValidation>) {
    console.log(values);
    const response = await editProfile({
      userId: userData.id,
      ...values,
    });
    if (response) {
      setUserData({
        ...userData,
        username: response.username,
        fullname: response.fullname,
        profilePicture: response.profilePicture,
        bio: response.bio,
      });
      navigate(`/profile/${userData.id}`);
      toast("Profile updated successfully!");
    } else {
      toast("Failed to make changes. Please try again");
    }
  }

  if (userData.id !== id) return;
  return (
    <div className="w-full">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-9 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ProfilePhotoUploader
                      fieldChange={field.onChange}
                      userData={userData}
                    />
                  </FormControl>

                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
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
                className="shad-button_primary whitespace-nowrap flex-center gap-2"
                disabled={isEditingProfile}
              >
                {isEditingProfile && <ReloadIcon className="animate-spin" />}
                <p className="cursor-pointer">
                  {isEditingProfile ? "Updating Profile..." : "Update Profile"}
                </p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
