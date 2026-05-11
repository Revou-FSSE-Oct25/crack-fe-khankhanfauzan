import { PaginationParams } from "./common";

export type UserProfile = {
    fullName: string;
    whatsappNumber: string;
    maritalStatus: "single" | "married" | string | null; // Menyesuaikan respons BE yang bisa null
    joinedAt: string;
};

export type UserDocument = {
    fotoProfileUrl: string | null;
    fotoKtpUrl: string | null;
    fotoBukuNikahUrl: string | null;
};

export type UserVerifiedStats = {
    isEmailVerified: boolean;
    isProfileVerified: boolean;
    isKtpVerified: boolean;
    isMarriageVerified: boolean;
};

export type User = {
    id: string;
    email: string;
    role: "tenant" | "admin" | string;
    profile: UserProfile;
    document: UserDocument;
    verified: UserVerifiedStats;
    createdAt?: string;
    updatedAt?: string;
};

export type UpdateUserPayload = Partial<
    Pick<User, "role"> & {
        fullName: string;
        whatsappNumber: string;
        maritalStatus: string;
        fotoProfileUrl: string | null;
        fotoKtpUrl: string | null;
        fotoBukuNikahUrl: string | null;
    }
>;

export type CreateUserPayload = {
    fullName: string;
    email: string;
    whatsappNumber: string;
    role?: string;
};

export interface GetUsersParams extends PaginationParams {
    role?: string;
    search?: string;
}