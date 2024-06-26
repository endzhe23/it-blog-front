"use client";
import "../../globals.css";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {createPost} from "@/helpers/post-api";
import {Box, Button, TextField} from "@mui/material";
import FormInput from "@/components/form-input";
import Autocomplete from "@mui/material/Autocomplete";
import {getCategories} from "@/helpers/category-api";

const PostScheme = z.object({
    categories: z.array(z.object({name: z.string()})),
    title: z.string().min(2, "Название поста не может содержать менее 2 символов.").max(50, "Название поста не может содержать более 50 символов."),
    content: z.string()
});

export default function Posts() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allCategories = await getCategories();
                console.log(allCategories);
                setCategories(allCategories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const zodForm = useForm<z.infer<typeof PostScheme>>({
        resolver: zodResolver(PostScheme),
        defaultValues: {
            categories: [],
            title: "",
            content: ""
        }
    });

    const {
        reset,
        handleSubmit,
        control,
        formState: {isSubmitSuccessful, errors}
    } = zodForm;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const onSubmit: SubmitHandler<z.infer<typeof PostScheme>> = (formData) => {
        const requestData = {...formData};
        console.log(requestData);
        createPost(requestData);
    };

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <FormProvider {...zodForm}>
                <Box
                    component="form"
                    noValidate
                    sx={{m: 1, width: '25ch'}}
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="categories"
                        control={control}
                        render={({field}) => (
                            <Autocomplete
                                multiple
                                id="categories"
                                options={categories}
                                getOptionLabel={(category) => category?.name}
                                filterSelectedOptions
                                value={field.value}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                onChange={(_, newValue) => field.onChange(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Categories" variant="standard"/>
                                )}
                            />
                        )}
                    />
                    <FormInput name="title" label="Title" variant="standard"/>
                    <FormInput name="content" label="Content" variant="standard"/>
                    <Button type="submit">Create</Button>
                </Box>
            </FormProvider>
        </main>
    );
}