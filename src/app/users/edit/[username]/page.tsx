"use client";
import React, {useEffect, useState} from "react";
import {z, ZodObject} from "zod";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@/types";
import {Avatar, Badge, Box, Button} from "@mui/material";
import {getUserByUsername, updateUser, UserUpdate} from "@/helpers/userApi";
import {ModeEditOutlineOutlined} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import FormInput from "@/components/FormInput";
import IconButton from "@mui/material/IconButton";

type UserData = {
    username: string
    email: string
    password: string,
    avatar: File
}

const UserScheme = z.object({
    username: z.optional(z.string()
        .min(2, "Имя пользователя не может содержать менее 2 символов.")
        .max(50, "Имя пользователя не может содержать более 50 символов.")
    ),
    avatar: z.optional(z.instanceof(File)),
    firstName: z.optional(z.string().min(2, "Имя не может содержать менее 2 символов.").max(50, "Имя не может содержать более 50 символов.")),
    lastName: z.optional(z.string()),
    bio: z.optional(z.string()),
    newEmail: z.optional(z.string()),
    currentPassword: z.optional(z.string()),
    newPassword: z.optional(z.string())
});

type PageParams = {
    username: string;
};

type PageProps = {
    params: PageParams;
};

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function Users({params}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();
    const [formData, setFormData] = useState<UserData>();
    const [avatarFile, setAvatarFile] = useState<File>();

    const zodForm = useForm<z.infer<typeof UserScheme>>({
        resolver: zodResolver(UserScheme),
        defaultValues: {
            username: "",
            avatar: undefined,
            firstName: "",
            lastName: "",
            bio: "",
            newEmail: "",
            currentPassword: "",
            newPassword: ""
        }
    });

    const {handleSubmit, register, formState: {errors}} = zodForm;

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserByUsername(username);
                setUser(userData);

                zodForm.reset({
                    username: userData.username,
                    avatar: undefined,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    bio: userData.bio,
                    newEmail: userData.email,
                    currentPassword: undefined,
                    newPassword: undefined
                });
            } catch (error) {
                console.error("Error fetching data: " + error);
            }
        }

        fetchData();
    }, [username, zodForm]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setUser(prev => prev ? {...prev, avatarUrl: URL.createObjectURL(file)} : prev);
        }
    };

    const onSubmit: SubmitHandler<z.infer<typeof UserScheme>> = (formData) => {
        const updatedUserData: UserUpdate = {
            ...formData,
            avatar: avatarFile
        };
        console.log(updatedUserData);
        updateUser(updatedUserData);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <FormProvider {...zodForm}>
                <Box
                    component="form"
                    noValidate
                    sx={{
                        m: 1, width: '25ch',
                    }}
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        badgeContent={
                            <IconButton component="label" color="inherit" sx={{p: 0}}>
                                {user?.avatarUrl && <ModeEditOutlineOutlined/>}
                                <VisuallyHiddenInput
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </IconButton>
                        }
                    >
                        <Avatar variant="rounded" src={user?.avatarUrl} sx={{width: 112, height: 112}}/>
                    </Badge>
                    <FormInput name="username" label="Username" variant="standard" defaultValue={user?.username}/>
                    <FormInput name="newEmail" label="Email" type="email" variant="standard" defaultValue={user?.email}/>
                    <FormInput name="firstName" label="First name" variant="standard" defaultValue={user?.firstName}/>
                    <FormInput name="lastName" label="Last name" variant="standard" defaultValue={user?.lastName}/>
                    <FormInput name="bio" label="Bio" variant="standard" defaultValue={user?.bio}/>
                    <FormInput name="currentPassword" label="Current password" type="password" variant="standard"/>
                    <FormInput name="newPassword" label="New password" type="password" variant="standard"/>
                    <Button type="submit">Update</Button>
                </Box>
            </FormProvider>
        </main>
    );
}