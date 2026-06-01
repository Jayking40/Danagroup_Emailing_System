import { create } from "zustand";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";


interface ProfileState {
  changeDP: (file: File) => Promise<{ avatarUrl: string; publicId: string }>;
  isLoading: boolean;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  isLoading: false,

  changeDP: async (file: File) => {
    set({ isLoading: true });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put("/users/change-dp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImage = response.data.data ?? response.data;

      const { user } = useAuthStore.getState();

      if (user) {
        useAuthStore.setState({
          user: {
            ...user,
            avatarUrl: uploadedImage.avatarUrl,
          },
        });
      }

      toast.success("Profile picture updated successfully!");

      return uploadedImage;
    } catch (error: any) {
      toast.error("Failed to change profile picture. Please try again.");
      throw new Error(
        error?.response?.data?.message || "Failed to change profile picture."
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));