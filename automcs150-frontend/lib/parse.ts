import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/lib/types";

export function parseAccessToken(accessToken: string) {
    if (!accessToken) {
        console.log("Access Token doesn't exist.");
        return null;
    }
    try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const { firstName, lastName, email, isAdmin } = decoded;
        return { firstName, lastName, email, isAdmin };
    } catch (error) {
        console.log("Invalid access token");
        return null; ``
    }
}

export function formatPhoneNumber(phoneNumber: string) {
    if (!phoneNumber) return "";
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-digits

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber;
}