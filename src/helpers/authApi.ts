import {axiosInstance} from "@/helpers/axiosInstance";
import {User} from "@/types";
import Cookies from 'js-cookie';

export type RegisterUser = {
    username: string
    email: string
    password: string
    avatar: File
}

export type LoginUser = {
    usernameOrEmail: string,
    password: string
}

export const register = (requestData: RegisterUser) => {
    axiosInstance.post("/auth/signup", requestData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
        .then((response) => console.log(response.data))
        .catch((error: any) => {
            console.error("Error registering user: " + error.message);
        });
}

export const login = async (requestData: LoginUser): Promise<User> => {
    try {
        await axiosInstance.post("/auth/login", requestData);
        const user = await currentUser();
        window.dispatchEvent(new Event("storage"));
        return user;
    } catch (error: any) {
        console.error("Error logging in user: " + error.message);
        throw new Error("Error logging in user");
    }
}

export const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
        console.log("User logged out successfully");
        Cookies.remove('user');
        window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
        console.error("Error logging out user: " + error.message);
    }
};

export const currentUser = async (): Promise<User> => {
    try {
        const response = await axiosInstance.get("/auth/current-user");
        const user: User = {
            ...response.data,
            avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.avatarUrl}`
        };
        Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
        return user
    } catch {
        throw new Error('Error fetching current user');
    }
};