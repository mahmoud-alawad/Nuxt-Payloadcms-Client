import type { PayloadRequestParams } from '../types';
import type { FetchOptions } from 'ofetch';
/**
 * @deprecated use `usePayload` for correct types
 */
export declare const usePayload: () => {
    find: <T>(contentType: string, params?: PayloadRequestParams, fetchOptions?: FetchOptions) => Promise<T>;
    findOne: <T_1>(contentType: string, id?: string | number | PayloadRequestParams, params?: PayloadRequestParams, fetchOptions?: FetchOptions) => Promise<T_1>;
    create: <T_2>(contentType: string, data: Partial<T_2>) => Promise<T_2>;
    update: <T_3>(contentType: string, id: string | number | Partial<T_3>, data?: Partial<T_3> | undefined) => Promise<T_3>;
    delete: <T_4>(contentType: string, id?: string | number) => Promise<T_4>;
};
