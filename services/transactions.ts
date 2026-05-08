import { http } from "@/lib/http/client"
import { GetInvoicesParams, Invoice } from "@/types/invoices"
import { ApiPaginatedResponse } from "@/types/types"

export async function uploadPaymentProof(payload: FormData, opts?: { token?: string }) {
    return http.post<any>("/transactions/upload-proof", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}

export async function fetchInvoices(params?: GetInvoicesParams, opts?: { token?: string }) {
    return http.get<ApiPaginatedResponse<Invoice[]>>("/invoices", {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}