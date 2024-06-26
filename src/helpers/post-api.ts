import {axiosInstance} from "@/helpers/axios";
import {Post} from "@/types";

export const createPost = (requestData: {
    title: string,
    content: string
}) => {
    axiosInstance.post("/posts", requestData)
        .then(() => console.log("Post created successfully"))
        .catch((error: any) => {
            console.error("Error creating book: " + error.message);
        });
}


export const updatePost = (id: number, requestData: {
    title?: string,
    content?: string
}) => {
    axiosInstance.put(`/posts/${id}`, requestData)
        .then(() => console.log("Post updated successfully"))
        .catch((error: any) => {
            console.error("Error updating post: " + error.message);
        });
}

export const getPosts = async (): Promise<Post[]> => {
    try {
        const response = await axiosInstance.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export const getPostById = async (id: number): Promise<Post> => {
    try {
        const response = await axiosInstance.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const deletePost = (id: number) => {
    axiosInstance.delete(`/posts/${id}`)
        .then(() => console.log("Post deleted successfully"))
        .catch((error) => console.error(error))
}