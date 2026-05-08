export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface BasePaginationMeta {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiPaginatedResponse<T, M = BasePaginationMeta> extends ApiResponse<T> {
    meta: M;
}