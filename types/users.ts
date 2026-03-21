export type UsersResponseMeta = {
    current_page: number;
    last_page: number;
    limit: number;
    total_data: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type UserProfile = {
    avatar_url: string | null;
    bio?: string;
    joined_at: string;
};

export type UserDocuments = {
    ktp_url: string;
    marriage_url?: string;
    is_verified: boolean;
};

export type UserCurrentStay = {
    room_number: string;
    property_name?: string;
    status: "active" | "verifying" | string;
};

export type User = {
    user_id: string;
    full_name: string;
    email: string;
    whatsapp_no?: string;
    role: "tenant" | string;
    marital_status?: "single" | "married" | string;
    profile?: UserProfile;
    documents?: UserDocuments;
    current_stay?: UserCurrentStay | null;
};

export type UsersResponse = {
    status: "success" | "error" | string;
    message: string;
    meta: UsersResponseMeta;
    data: User[];
};

export type UpdateUserPayload = Partial<
    Pick<User, "full_name" | "email" | "whatsapp_no" | "role" | "marital_status"> & {
        profile?: Pick<UserProfile, "bio">;
    }
>;

export type CreateUserPayload = {
    full_name: string;
    email: string;
    whatsapp_no?: string;
    role: string;
    marital_status?: string;
    profile?: Pick<UserProfile, "bio">;
};
