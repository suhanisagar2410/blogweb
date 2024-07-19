import axios from "axios";
// import conf from "../conf/conf";

const API_URL = "http://localhost:3000";

const postServices = {
  createPost: async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/post/create-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
  updatePost: async (postId, formData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/post/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },
  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/post/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
  getPost: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/post/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },
  getAllThePosts: async (page) => {
    try {
      const response = await axios.get(`${API_URL}/post/all-post?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching all posts");
    }
  },

  getPostsByCategory: async (category, page) => {
    try {
      const response = await axios.get(
        `${API_URL}/post/category/${category}?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      throw error;
    }
  },

  getPostsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/post/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      throw error;
    }
  },
  // getFilePreview: async (featuredimage) => {
  //   // console.log("Hellowwww");
  //   try {
  //     const response = await axios.get(`${API_URL}/post/images/${featuredimage}`);
  //     // console.log("Response:",response);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching file preview:", error);
  //     throw error;
  //   }
  // },
};

export default postServices;
