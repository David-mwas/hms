import toast from "react-hot-toast";
import { User } from "../types/user";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

function getToken() {
  return (() => {
    const stored = localStorage.getItem("hmsUser");
    const data: User = JSON.parse(stored ? stored : "");
    if (!data.token) return null;
    try {
      return data.token;
    } catch {
      return null;
    }
  })();
}

export const api = {
  get: async (path: string) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  post: async (path: string, body: unknown, title: string) => {
    const token = getToken();
    const res = await toast.promise(
      fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }),
      {
        loading: `Creating ${title}...`,
        success: `${title} created successful`,
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || `${title} creation failed`,
      }
    );
    if (!res.ok) throw new Error("Failed to post data");
    return res.json();
  },

  put: async (path: string, body: unknown, title: string) => {
    const token = getToken();
    const res = await toast.promise(
      fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }),
      {
        loading: `Updating ${title}...`,
        success: `${title} updated successful`,
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || `${title} update failed`,
      }
    );
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  },
  patch: async (path: string, body: unknown, title: string) => {
    const token = getToken();
    const res = await toast.promise(
      fetch(`${BASE_URL}${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }),
      {
        loading: `Updating ${title}...`,
        success: `${title} updated successful`,
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || `${title} update failed`,
      }
    );
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  },

  delete: async (path: string, title: string) => {
    const token = getToken();
    const res = await toast.promise(
      fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      {
        loading: `Removing ${title}...`,
        success: `${title} Removed successful`,
        error: (err) =>
          typeof err === "string"
            ? err
            : err?.message || `${title} delete failed`,
      }
    );
    if (!res.ok) throw new Error("Failed to delete");
    return res.json();
  },
};
