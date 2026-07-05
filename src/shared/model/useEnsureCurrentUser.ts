    import { useEffect } from "react";

    import { getMyInfo } from "@/features/my-page/personal-info/api/getMyInfo";
    import { useUserStore } from "@/shared/store/userStore";

    export const useEnsureCurrentUser = () => {
    const isLoaded = useUserStore((state) => state.isLoaded);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (isLoaded) {
        return;
        }

        let isCancelled = false;

        const loadCurrentUser = async () => {
        const { data } = await getMyInfo();

        if (!isCancelled && data) {
            setUser(data);
        }
        };

        void loadCurrentUser();

        return () => {
        isCancelled = true;
        };
    }, [isLoaded, setUser]);
    };