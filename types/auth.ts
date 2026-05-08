// Payloads
export type RegisterPayload = {
    fullname: string;
    email: string;
    whatsappNumber: string;
    password: string;
    confirmPassword: string;
}

export type LoginPayload = {
    email: string;
    password: string;
}

export type RefreshPayload = {
    refreshToken: string;
}

export type ForgotPayload = {
    email: string;
}

export type ResetPayload = {
    token: string;
    password: string;
    confirmPassword: string;
}

export type Tokens = {
    accessToken: string;
    refreshToken: string;
}

// Gunakan "&" untuk menggabungkan tipe Tokens dengan data User
export type AuthLoginData = Tokens & {
    user: {
        id: number | string;
        fullname: string;
        email: string;
        whatsappNumber?: string;
        role: string;
    };
}

export type AuthRefreshData = Tokens;

export type AuthRegisterData = AuthLoginData