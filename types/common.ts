export interface PaginationParams {
    page?: number;
    perPage?: number;
    search?: string;
    [key: string]: any;
}

export interface Props {
    params: Promise<{ id: string }>;
}
