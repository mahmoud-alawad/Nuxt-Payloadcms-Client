/* eslint-disable camelcase */

import type { Ref } from 'vue'
import type {
  PayloadCmsAuthenticationData,
  PayloadCmsEmailConfirmationData,
  PayloadCmsRegistrationData,
  PayloadCmsResetPasswordData,
  PayloadCmsChangePasswordData,
  PayloadCmsUser,
  PayloadCmsAuthenticationResponse,
  PayloadCmsForgotPasswordData,
} from '../types'
import { usePayloadCmsToken } from './usePayloadCmsToken'
import { usePayloadCmsUser } from './usePayloadCmsUser'
import { usePayloadCmsClient } from './usePayloadCmsClient'
import { usePayloadCmsUrl } from './usePayloadCmsUrl'
import { useRuntimeConfig } from '#imports'

export const usePayloadCmsAuth = () => {
  const url = usePayloadCmsUrl()
  const token = usePayloadCmsToken()
  const user = usePayloadCmsUser()
  const client = usePayloadCmsClient()
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public

  const setToken = (value: string | null) => {
    token.value = value
  }
  const setUser = (value: PayloadCmsUser) => {
    user.value = value
  }

  const fetchUser = async (): Promise<Ref<PayloadCmsUser>> => {
    if (token.value) {
      try {
        user.value = await client('/users/me', {
          params: config.payloadCms.auth,
        })
      } catch (e) {
        setToken(null)
      }
    }

    return user
  }

  /**
   * Authenticate user & retrieve his JWT
   *
   * @param  {PayloadCmsAuthenticationData} data - User authentication form: `identifier`, `password`
   * @param  {string} data.identifier - The email or username of the user
   * @param  {string} data.password - The password of the user
   * @returns Promise<PayloadCmsAuthenticationResponse>
   */
  const login = async (
    data: PayloadCmsAuthenticationData,
  ): Promise<PayloadCmsAuthenticationResponse> => {
    setToken(null)

    const { jwt }: PayloadCmsAuthenticationResponse = await client(
      '/auth/local',
      { method: 'POST', body: data },
    )

    setToken(jwt)

    const user = await fetchUser()

    return {
      user,
      jwt,
    }
  }

  /**
   * Logout by removing authentication token
   *
   * @returns void
   */
  const logout = (): void => {
    setToken(null)
    setUser(null)
  }

  /**
   * Register a new user & retrieve JWT
   *
   * @param  {PayloadCmsRegistrationData} data - New user registration form: `username`, `email`, `password`
   * @param  {string} data.username - Username of the new user
   * @param  {string} data.email - Email of the new user
   * @param  {string} data.password - Password of the new user
   * @returns Promise<PayloadCmsAuthenticationResponse>
   */
  const register = async (
    data: PayloadCmsRegistrationData,
  ): Promise<PayloadCmsAuthenticationResponse> => {
    setToken(null)

    const { jwt }: PayloadCmsAuthenticationResponse = await client(
      '/auth/local/register',
      { method: 'POST', body: data },
    )

    setToken(jwt)

    const user = await fetchUser()

    return {
      user,
      jwt,
    }
  }

  /**
   * Send an email to a user in order to reset his password
   *
   * @param  {PayloadCmsForgotPasswordData} data - Forgot password form: `email`
   * @param  {string} data.email - Email of the user who forgot his password
   * @returns Promise<void>
   */
  const forgotPassword = async (
    data: PayloadCmsForgotPasswordData,
  ): Promise<void> => {
    setToken(null)

    await client('/auth/forgot-password', { method: 'POST', body: data })
  }

  /**
   * Reset the user password
   *
   * @param  {PayloadCmsForgotPasswordData} data - Reset password form: `code`, `password`, `passwordConfirmation`
   * @param  {string} data.code - Code received by email after calling the `forgotPassword` method
   * @param  {string} data.password - New password of the user
   * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
   * @returns Promise<PayloadCmsAuthenticationResponse>
   */
  const resetPassword = async (
    data: PayloadCmsResetPasswordData,
  ): Promise<PayloadCmsAuthenticationResponse> => {
    setToken(null)

    const { jwt }: PayloadCmsAuthenticationResponse = await client(
      '/auth/reset-password',
      { method: 'POST', body: data },
    )

    setToken(jwt)

    const user = await fetchUser()

    return {
      user,
      jwt,
    }
  }

  /**
   * Change the user password
   *
   * @param  {PayloadCmsChangePasswordData} data - Change password form: `currentPassword`, `password`, `passwordConfirmation`
   * @param  {string} data.currentPassword - Current password of the user
   * @param  {string} data.password - New password of the user
   * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
   * @returns Promise<void>
   */
  const changePassword = async (
    data: PayloadCmsChangePasswordData,
  ): Promise<void> => {
    await client('/auth/change-password', { method: 'POST', body: data })
  }

  /**
   * Send programmatically an email to a user in order to confirm his account
   *
   * @param  {PayloadCmsEmailConfirmationData} data - Email confirmation form: `email`
   * @param  {string} data.email - Email of the user who want to be confirmed
   * @returns Promise<void>
   */
  const sendEmailConfirmation = async (
    data: PayloadCmsEmailConfirmationData,
  ): Promise<void> => {
    await client('/auth/send-email-confirmation', {
      method: 'POST',
      body: data,
    })
  }

  return {
    setToken,
    setUser,
    fetchUser,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    sendEmailConfirmation,
  }
}
