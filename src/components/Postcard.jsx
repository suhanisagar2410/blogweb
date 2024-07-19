import { Link } from "react-router-dom";

function PostCard({ $id, title, imagePath }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-black text-white rounded-xl p-4 shadow-md overflow-hidden hover:shadow-lg">
        <div className="w-full justify-center mb-4">
          {imagePath ? (
            <img src={imagePath} alt={title} className="rounded-xl" />
          ) : (
            <div
              className="rounded-xl bg-gray-400"
              style={{ height: "200px" }}
            />
          )}
        </div>
        <h2 className="text-xl font-bold">
          {title.length > 20 ? `${title.slice(0, 20)}...` : title}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
