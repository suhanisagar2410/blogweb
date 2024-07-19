import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postServices from "../services/postService";
import { Button, Container } from "../components";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const fetchedPost = await postServices.getPost(id);
        if (fetchedPost && fetchedPost.post) {
          setPost(fetchedPost.post);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/");
      }
    };

    if (id) {
      fetchPostById();
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (post && userData) {
      setIsAuthor(post.userId === userData.user.id);
    }
  }, [post, userData]);

  const deletePost = async () => {
    try {
      await postServices.deletePost(post.id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {post.imagePath && (
            <img src={post.imagePath} alt={post.title} className="rounded-xl" />
          )}
          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
              <Button onClick={() => navigate("/")} className="">
                Go to All Posts
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold text-center">{post.title}</h1>
        </div>
        <div className="browser-css text-center">{post.content}</div>
      </Container>
    </div>
  ) : null;
}
