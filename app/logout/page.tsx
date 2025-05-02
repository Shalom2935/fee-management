"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout actions here
    // For example, clear localStorage tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Redirect to login page
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Déconnexion en cours...</h1>
        <p className="text-gray-500">Vous allez être redirigé vers la page de connexion.</p>
      </div>
    </div>
  );
}