"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router, isMounted]);

  // Durante a hidratação, renderizar os filhos sem verificação
  if (!isMounted) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#F8F8F8',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 400,
            fontSize: 18,
            color: '#737373',
          }}
        >
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 