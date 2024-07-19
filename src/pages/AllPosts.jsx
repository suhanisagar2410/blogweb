import { useState, useEffect } from "react";
import postServices from "../services/postService";
import { Container, Postcard  } from "../components";
import { useSelector } from "react-redux";

function AllPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  console.log("userData:", userData);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (userData && userData.user.id) {
        try {
          const postsData = await postServices.getPostsByUser(userData.user.id);
          if (postsData && postsData.posts) {
            setUserPosts(postsData.posts);
          }
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      }
    };

    fetchUserPosts();
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {userPosts.map((post) => (
            <div key={post.id} className="p-2 w-1/4 bg-slate-50 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
              <Postcard
                $id={post.id}
                title={post.title}
                imagePath={post.imagePath}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;