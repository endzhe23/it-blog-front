"use client";
import {useEffect, useState} from "react";
import {Category} from "@/types";
import {getCategoryById} from "@/helpers/category-api";
import Link from "next/link";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const categoryId: number = params.id;
    const [category, setCategory] = useState<Category>();

    useEffect(() => {
        async function fetchData() {
            try {
                const genreData = await getCategoryById(categoryId);
                setCategory(genreData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [categoryId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>{category?.name}</div>
            {category?.posts?.map((post) => (
                <ul key={post.id}>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </ul>
            ))}
        </main>
    );
}