import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteWrapperProps {
    children: React.ReactNode;
}

export default function ProtectedRouteWrapper({ children }: ProtectedRouteWrapperProps) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // List of public routes that don't require authentication
    const publicRoutes = ["/", "/features", "/pricing"]
    const isPublicRoute = publicRoutes.includes(router.pathname)

    useEffect(() => {
        if (!isLoading && !user && !isPublicRoute) {
            router.push("/")
        }
    }, [user, isLoading, router.pathname, isPublicRoute, router])

    // Show nothing while checking auth
    if (isLoading) {
        return null
    }

    // Allow render if it's a public route or user is authenticated
    return <>{children}</>
}
