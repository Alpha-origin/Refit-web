    import { create } from "zustand";

    interface UserProfile {
    id: number | null;
    name: string;
    nickname: string;
    email: string;
    }

    interface UserState extends UserProfile {
    isLoaded: boolean;
    setUser: (user: Partial<UserProfile>) => void;
    reset: () => void;
    }

    const INITIAL_PROFILE: UserProfile = {
    id: null,
    name: "",
    nickname: "",
    email: "",
    };

    export const useUserStore = create<UserState>((set) => ({
    ...INITIAL_PROFILE,
    isLoaded: false,
    setUser: (user) =>
        set((state) => ({
        ...state,
        ...user,
        isLoaded: true,
        })),
    reset: () => set({ ...INITIAL_PROFILE, isLoaded: false }),
    }));