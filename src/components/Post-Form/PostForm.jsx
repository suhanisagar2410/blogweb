import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import postServices from "../../services/postService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, reset } =
    useForm({
      defaultValues: {
        title: "",
        slug: "",
        content: "",
        status: "active",
        userId: "",
        category: "",
      },
    });

  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.userData);
  console.log("Post:", post);
  useEffect(() => {
    if (post && post.imagePath) {
      setImageURL(`${post.imagePath}`);
    }
  }, [post]);

  const submit = async (data) => {
    const contentWithoutTags = data.content.replace(/<[^>]*>/g, "");
    const postId = post?.id;
    const previousImageId = postId ? post?.featuredimage : null;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", contentWithoutTags);
    formData.append("status", data.status);
    formData.append("userId", user.id);
    formData.append("category", data.category);

    if (data.image && data.image.length > 0) {
      formData.append("featuredimage", data.image[0]);
    } else if (previousImageId) {
      formData.append("featuredimage", previousImageId);
    }

    try {
      if (postId) {
        const dbPost = await postServices.updatePost(postId, formData);
        if (dbPost) {
          navigate(`/post/${dbPost.id}`);
          alert("Your Post Updated Successfully!");
        }
      } else {
        const dbPost = await postServices.createPost(formData);
        if (dbPost) {
          navigate(`/post/${dbPost.id}`);
          alert("Your Post Added Successfully!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        status: post.status || "active",
        category: post.category || "",
      });
    }
  }, [post, reset]);

  return (
    <form
      action="/upload"
      method="POST"
      onSubmit={handleSubmit(submit)}
      className="flex flex-wrap"
    >
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
        />
        {imageURL && (
          <div className="w-full mb-4">
            <img
              src={imageURL}
              alt={post?.title || "Featured Image"}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Select
          options={[
            "General",
            "Technology",
            "Business",
            "Science",
            "Politics",
            "Movies",
            "Fashion",
            "Food",
            "DIY",
          ]}
          {...register("category", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
        {post && (
          <Button onClick={() => navigate("/all-posts")} className="w-full">
            {"Go to All Posts"}
          </Button>
        )}
      </div>
    </form>
  );
}
