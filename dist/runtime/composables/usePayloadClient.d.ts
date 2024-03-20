import type { FetchOptions } from 'ofetch';
export declare const usePayloadClient: () => <T>(url: string, fetchOptions?: FetchOptions) => Promise<T>;
