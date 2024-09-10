import axios from "axios";

const baseURL = process.env.GITHUB_API || "https://api.github.com/graphql";

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
