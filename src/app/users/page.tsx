"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {User} from "@/types";
import {deleteUser, getAuthors} from "@/helpers/userApi";
import Link from "next/link";
import {Button} from "@mui/material";

function Page() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const allUsers = await getAuthors();
                console.log(allUsers)
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const userId = event.currentTarget.id
        setUsers(users.filter((user) => user.username !== userId))
        deleteUser(userId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {users && users?.map((user) => (
                <ul key={user.username}>
                    <li>Имя пользователя: <Link href={`/users/${user.username}`}>{user.username}</Link></li>
                    <li>Статьи пользователя:</li>
                    {user.articles?.map((article) => (
                        <ul key={`/articles/${article.id}`}>
                            <li><Link href={`/articles/${article.id}`}>{article.title}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/users/edit/${user.username}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                    <Link href={`/users`}>
                        <Button id={user.username} onClick={handleDelete}>Удалить пользователя</Button>
                    </Link>
                </ul>
            ))}
        </main>
    );
}

export default Page
