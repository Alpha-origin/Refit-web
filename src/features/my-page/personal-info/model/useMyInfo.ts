    import { useCallback, useEffect, useState } from "react";

    import { getMyInfo } from "@/features/my-page/personal-info/api/getMyInfo";
    import { updateMyInfo } from "@/features/my-page/personal-info/api/updateMyInfo";
    import { useUserStore } from "@/shared/store/userStore";

    interface PersonalInfoDraft {
    name: string;
    nickname: string;
    email: string;
    }

    export const useMyInfo = () => {
    const name = useUserStore((state) => state.name);
    const nickname = useUserStore((state) => state.nickname);
    const email = useUserStore((state) => state.email);
    const isLoaded = useUserStore((state) => state.isLoaded);
    const setUser = useUserStore((state) => state.setUser);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(!isLoaded);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [draft, setDraft] = useState<PersonalInfoDraft>({ name, nickname, email });

    const loadMyInfo = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        const { data, errorMessage: loadErrorMessage } = await getMyInfo();

        if (loadErrorMessage || !data) {
        setErrorMessage(loadErrorMessage || "회원 정보를 불러오지 못했습니다.");
        setIsLoading(false);
        return;
        }

        setUser(data);
        setIsLoading(false);
    }, [setUser]);

    useEffect(() => {
        if (!isLoaded) {
        void loadMyInfo();
        }
    }, [isLoaded, loadMyInfo]);

    useEffect(() => {
        if (!isEditing) {
        setDraft({ name, nickname, email });
        }
    }, [name, nickname, email, isEditing]);

    const handleFieldChange = (field: keyof PersonalInfoDraft, value: string) => {
        setDraft((previousDraft) => ({ ...previousDraft, [field]: value }));
    };

    const handleToggleEdit = useCallback(async () => {
        if (!isEditing) {
        setErrorMessage("");
        setDraft({ name, nickname, email });
        setIsEditing(true);
        return;
        }

        setIsSaving(true);
        setErrorMessage("");

        const { errorMessage: saveErrorMessage } = await updateMyInfo(draft);

        setIsSaving(false);

        if (saveErrorMessage) {
        setErrorMessage(saveErrorMessage);
        return;
        }

        setUser(draft);
        setIsEditing(false);
    }, [isEditing, draft, name, nickname, email, setUser]);

    return {
        draft,
        errorMessage,
        isEditing,
        isLoading,
        isSaving,
        onFieldChange: handleFieldChange,
        onToggleEdit: handleToggleEdit,
    };
    };