import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import postServices from "../services/postService";
import { Container } from "../components";
import Select from "../components/Select";
import PostCard from "../components/Postcard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const initialLoad = useRef(true);

  const fetchPosts = useCallback(async (category, page, reset = false) => {
    try {
      console.log("Fetching page:", page, "Reset:", reset);
      let postsData;

      if (category === "General") {
        postsData = await postServices.getAllThePosts(page);
      } else {
        postsData = await postServices.getPostsByCategory(category, page);
      }

      if (postsData && postsData.posts.length > 0) {
        console.log("Reset:", reset);
        console.log("postsData.posts", postsData.posts);
        setPosts((prevPosts) =>
          reset ? postsData.posts : [...prevPosts, ...postsData.posts]
        );

        setError(null);
        setHasMore(postsData.posts.length === 8);
      } else {
        setHasMore(false);
        if (reset) {
          setPosts([]);
        }
      }
    } catch (error) {
      setError("Failed to fetch posts. Please try again later.");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    console.log("Category changed:", selectedCategory);
    setPage(1);
    fetchPosts(selectedCategory, 1, true);
  }, [selectedCategory, fetchPosts]);

  useEffect(() => {
    if (page > 1) {
      console.log("Loading more posts for page:", page);
      fetchPosts(selectedCategory, page, false);
    }
  }, [page, fetchPosts, selectedCategory]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    console.log("Category selected:", category);
    setSelectedCategory(category);
  };

  const loadMorePosts = () => {
    console.log("Load more clicked");
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="w-full py-8">
      <Container>
        {error && <h1 className="text-center">{error}</h1>}
        {!authStatus && (
          <h1 className="text-center font-extrabold text-3xl">
            Log In To Get The Posts
          </h1>
        )}
        {authStatus && (
          <>
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
              label="Category"
              className="ml-1 bg-slate-100 select-input"
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
            <div className="flex flex-wrap">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-2 w-1/4 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <PostCard
                    key={post.id}
                    $id={post.id}
                    title={post.title}
                    imagePath={post.imagePath}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {hasMore && authStatus && (
          <div className="flex justify-center mt-5">
            <button
              className="bg-black rounded-2xl hover:bg-gray-400 text-white font-bold py-2 px-4 disabled:opacity-50"
              onClick={loadMorePosts}
            >
              Load more
            </button>
          </div>
        )}
        {posts.length === 0 && (
          <h1 className="text-center font-extrabold text-3xl">
            No posts available for this category. Try Another One :)
          </h1>
        )}
      </Container>
    </div>
  );
}

export default Home;
