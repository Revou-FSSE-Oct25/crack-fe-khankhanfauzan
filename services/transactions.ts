import { http } from "@/lib/http/client"
import { GetInvoicesParams, Invoice, VerifyTransactionPayload } from "@/types/invoices"
import { ApiPaginatedResponse, ApiResponse } from "@/types/types"

export async function uploadPaymentProof(payload: FormData, opts?: { token?: string }) {
    return http.post<any>("/transactions/upload-proof", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}


export async function fetchInvoices(params?: GetInvoicesParams, opts?: { token?: string }) {
    return http.get<ApiPaginatedResponse<Invoice[]>>("/invoices", {
        cache: "no-store",
        query: params,
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function getInvoiceById(id: string, opts?: { token?: string }) {
    return http.get<ApiResponse<Invoice>>(`/invoices/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function verifyTransaction(id: string, payload: VerifyTransactionPayload, opts?: { token?: string }) {
    return http.patch<ApiResponse<Invoice>>(`/transactions/${id}/verify`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
