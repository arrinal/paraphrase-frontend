import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteWrapperProps {
    children: React.ReactNode;
}

export default function ProtectedRouteWrapper({ children }: ProtectedRouteWrapperProps) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // List of public routes
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    useEffect(() => {
        if (!isLoading && !user && !isPublicRoute) {
            router.push('/');
        }
    }, [user, isLoading, router.pathname, isPublicRoute, router]);

    return <>{children}</>;
}
