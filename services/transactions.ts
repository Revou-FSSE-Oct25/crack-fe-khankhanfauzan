import { http } from "@/lib/http/client"

export async function uploadPaymentProof(payload: FormData, opts?: { token?: string }) {
    return http.post<any>("/transactions/upload-proof", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}