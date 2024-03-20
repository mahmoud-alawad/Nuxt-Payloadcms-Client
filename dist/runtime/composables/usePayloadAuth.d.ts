import type { Ref } from 'vue';
import type { PayloadAuthenticationData, PayloadEmailConfirmationData, PayloadRegistrationData, PayloadResetPasswordData, PayloadChangePasswordData, PayloadUser, PayloadAuthenticationResponse, PayloadForgotPasswordData } from '../types';
export declare const usePayloadAuth: () => {
    setToken: (value: string | null) => void;
    setUser: (value: PayloadUser) => void;
    fetchUser: () => Promise<Ref<PayloadUser>>;
    login: (data: PayloadAuthenticationData) => Promise<PayloadAuthenticationResponse>;
    logout: () => Promise<void>;
    register: (data: PayloadRegistrationData) => Promise<PayloadAuthenticationResponse>;
    forgotPassword: (data: PayloadForgotPasswordData) => Promise<void>;
    resetPassword: (data: PayloadResetPasswordData) => Promise<PayloadAuthenticationResponse>;
    changePassword: (data: PayloadChangePasswordData) => Promise<void>;
    sendEmailConfirmation: (data: PayloadEmailConfirmationData) => Promise<void>;
    user: Ref<T>;
};
