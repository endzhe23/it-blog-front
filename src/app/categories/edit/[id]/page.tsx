"use client";
import "../../../globals.css"
import {z} from "zod"
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {deleteCategory, getCategoryById, updateCategory} from "@/helpers/categoryApi";
import {Box, Button} from "@mui/material";
import FormInput from "@/components/FormInput";
import {WithAuth} from "@/components/WithAuth";
import Alert from '@mui/material/Alert';

const CategoryScheme = z.object({
    name: z.optional(z.string().min(2, "Название категории не может содержать менее 2 символов.").max(50, "Название категории не может содержать более 50 символов."))
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

function Categories({params}: PageProps) {
    const categoryId: number = params.id
    const [alertClose, setAlertClose] = useState<boolean>(true);
    const [alertText, setAlertText] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | "info">("info");
    const [category, setCategory] = useState<Category>();

    const zodForm = useForm<z.infer<typeof CategoryScheme>>({
        resolver: zodResolver(CategoryScheme),
        defaultValues: {
            name: ""
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const categoryData = await getCategoryById(categoryId);
                setCategory(categoryData);


                zodForm.reset({
                    name: categoryData.name
                });
            } catch (error) {
                console.error("Error fetching data: " + error);
            }
        }

        fetchData();
    }, [categoryId, zodForm]);

    const {
        reset,
        handleSubmit,
        register,
        formState: {isSubmitSuccessful, errors}
    } = zodForm

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset])

    const onSubmit = (formData: z.infer<typeof CategoryScheme>) => {
        const requestData = {...formData}
        console.log(formData)
        updateCategory(categoryId, formData).then((response) => {
            setAlertSeverity("success")
            setAlertText(response)
            setAlertClose(false)
        }).catch((error) => {
            setAlertSeverity("error")
            setAlertText(error)
            setAlertClose(false)
        })
        setTimeout(() => setAlertClose(true), 10000)
    }

    const handleDelete = () => {
        deleteCategory(categoryId)
    }

    const handleAlertClose = () => {
        setAlertClose(true)
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
                    <FormInput name="name" label="Name" variant="standard" defaultValue={category?.name}/>
                    <Button type="submit">Update</Button>
                    <Button className="article-btn" variant="outlined" onClick={handleDelete}>Delete category</Button>
                </Box>
            </FormProvider>
            {!alertClose && <Alert variant="filled" severity={alertSeverity} onClose={handleAlertClose}>
                {alertText}
            </Alert>}
        </main>
    );
}

export default WithAuth(Categories)