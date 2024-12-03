import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

function NotLoggedIn() {
    const router = useRouter();
    
    return (
        <div className="container w-full flex flex-col justify-center min-h-[75vh] max-h-max mt-8">
            <div className="flex flex-col items-center mx-auto">
                <h1>You are not logged in. Please log in to view the data.</h1>
                <Button onClick={() => router.push('/Login')} className="min-w-[50%] mt-2">Login</Button>
            </div>
        </div>
        )
}

export default NotLoggedIn