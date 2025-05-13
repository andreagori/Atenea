// src/hooks/useUser.ts
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const useUser = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("auth_token");
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get<{ username: string }>("http://localhost:3000/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data); // { username: '...' }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};
