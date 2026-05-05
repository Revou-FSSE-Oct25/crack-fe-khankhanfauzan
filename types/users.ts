export type UsersResponseMeta = {
    current_page: number;
    last_page: number;
    limit: number;
    total_data: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type UserProfile = {
    avatarUrl: string | null;
    joinedAt: string;
};

export type UserDocuments = {
    ktpUrl: string;
    marriageUrl?: string;
};

export type UserCurrentStay = {
    roomNumber: string;
    propertyName?: string;
    status: "active" | "inactive" | "verifying" | string;
};

export type User = {
    id: string;
    fullName: string;
    email: string;
    whatsappNumber?: string;
    role: "tenant" | string;
    maritalStatus?: "single" | "married" | string;
    profile?: UserProfile;
    documents?: UserDocuments;
    currentStay?: UserCurrentStay | null;
};

export type UsersResponse = {
    status: "success" | "error" | string;
    message: string;
    meta: UsersResponseMeta;
    data: User[];
};

export type UpdateUserPayload = Partial<
    Pick<User, "fullName" | "email" | "whatsappNumber" | "role" | "maritalStatus">
>;

export type CreateUserPayload = {
    fullname: string;
    email: string;
    whatsappNumber?: string;
    role: string;
    maritalStatus?: string;
};
