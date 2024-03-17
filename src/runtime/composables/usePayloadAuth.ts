/* eslint-disable camelcase */

import type { Ref } from 'vue'
import type {
  PayloadAuthenticationData,
  PayloadEmailConfirmationData,
  PayloadRegistrationData,
  PayloadResetPasswordData,
  PayloadChangePasswordData,
  PayloadUser,
  PayloadAuthenticationResponse,
  PayloadForgotPasswordData,
} from '../types'
import { usePayloadToken } from './usePayloadToken'
import { usePayloadUser } from './usePayloadUser'
import { usePayloadClient } from './usePayloadClient'
import { usePayloadUrl } from './usePayloadUrl'
import { useRuntimeConfig } from '#imports'

export const usePayloadAuth = () => {
  const url = usePayloadUrl()
  const token = usePayloadToken()
  const user = usePayloadUser()
  const client = usePayloadClient()
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public

  const setToken = (value: string | null) => {
    token.value = value
  }
  const setUser = (value: PayloadUser) => {
    user.value = value
  }

  const fetchUser = async (): Promise<Ref<PayloadUser>> => {
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
   * @param  {PayloadAuthenticationData} data - User authentication form: `identifier`, `password`
   * @param  {string} data.identifier - The email or username of the user
   * @param  {string} data.password - The password of the user
   * @returns Promise<PayloadAuthenticationResponse>
   */
  const login = async (
    data: PayloadAuthenticationData,
  ): Promise<PayloadAuthenticationResponse> => {
    setToken(null)

    const { token, user }: PayloadAuthenticationResponse = await client(
      '/users/login',
      { method: 'POST', body: data },
    )

    setToken(token)

    return {
      user,
      token,
    }
  }

  /**
   * Logout by removing authentication token
   *
   */
  const logout = async () => {
    try {
      await client('/users/logout', { method: 'POST' })
      setToken(null)
      setUser(null)
    } catch (error) {}
  }

  /**
   * Register a new user & retrieve JWT
   *
   * @param  {PayloadRegistrationData} data - New user registration form: `username`, `email`, `password`
   * @param  {string} data.username - Username of the new user
   * @param  {string} data.email - Email of the new user
   * @param  {string} data.password - Password of the new user
   * @returns Promise<PayloadAuthenticationResponse>
   */
  const register = async (
    data: PayloadRegistrationData,
  ): Promise<PayloadAuthenticationResponse> => {
    setToken(null)

    const { token, user }: PayloadAuthenticationResponse = await client(
      '/users',
      {
        method: 'POST',
        body: data,
      },
    )

    setToken(token)

    return {
      user,
      token,
    }
  }

  /**
   * Send an email to a user in order to reset his password
   *
   * @param  {PayloadForgotPasswordData} data - Forgot password form: `email`
   * @param  {string} data.email - Email of the user who forgot his password
   * @returns Promise<void>
   */
  const forgotPassword = async (
    data: PayloadForgotPasswordData,
  ): Promise<void> => {
    setToken(null)

    await client('/auth/forgot-password', { method: 'POST', body: data })
  }

  /**
   * Reset the user password
   *
   * @param  {PayloadForgotPasswordData} data - Reset password form: `code`, `password`, `passwordConfirmation`
   * @param  {string} data.code - Code received by email after calling the `forgotPassword` method
   * @param  {string} data.password - New password of the user
   * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
   * @returns Promise<PayloadAuthenticationResponse>
   */
  const resetPassword = async (
    data: PayloadResetPasswordData,
  ): Promise<PayloadAuthenticationResponse> => {
    setToken(null)

    const { token }: PayloadAuthenticationResponse = await client(
      '/auth/reset-password',
      { method: 'POST', body: data },
    )

    setToken(token)

    const user = await fetchUser()

    return {
      user,
      token,
    }
  }

  /**
   * Change the user password
   *
   * @param  {PayloadChangePasswordData} data - Change password form: `currentPassword`, `password`, `passwordConfirmation`
   * @param  {string} data.currentPassword - Current password of the user
   * @param  {string} data.password - New password of the user
   * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
   * @returns Promise<void>
   */
  const changePassword = async (
    data: PayloadChangePasswordData,
  ): Promise<void> => {
    await client('/auth/change-password', { method: 'POST', body: data })
  }

  /**
   * Send programmatically an email to a user in order to confirm his account
   *
   * @param  {PayloadEmailConfirmationData} data - Email confirmation form: `email`
   * @param  {string} data.email - Email of the user who want to be confirmed
   * @returns Promise<void>
   */
  const sendEmailConfirmation = async (
    data: PayloadEmailConfirmationData,
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
    user,
  }
}
