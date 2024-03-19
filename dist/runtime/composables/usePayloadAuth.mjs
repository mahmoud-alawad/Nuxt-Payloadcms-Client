import { usePayloadToken } from "./usePayloadToken.mjs";
import { usePayloadUser } from "./usePayloadUser.mjs";
import { usePayloadClient } from "./usePayloadClient.mjs";
import { usePayloadUrl } from "./usePayloadUrl.mjs";
import { useRuntimeConfig } from "#imports";
export const usePayloadAuth = () => {
  const url = usePayloadUrl();
  const token = usePayloadToken();
  const user = usePayloadUser();
  const client = usePayloadClient();
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public;
  const setToken = (value) => {
    token.value = value;
  };
  const setUser = (value) => {
    user.value = value;
  };
  const fetchUser = async () => {
    if (token.value) {
      try {
        user.value = await client("/users/me", {
          //@ts-ignore
          params: config.payload.auth
        });
      } catch (e) {
        setToken(null);
      }
    }
    return user;
  };
  const login = async (data) => {
    setToken(null);
    const { token: token2, user: user2 } = await client(
      "/users/login",
      { method: "POST", body: data }
    );
    setToken(token2);
    setUser(user2.value);
    return {
      user: user2,
      token: token2
    };
  };
  const logout = async () => {
    try {
      await client("/users/logout", { method: "POST" });
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };
  const register = async (data) => {
    setToken(null);
    const { token: token2, user: user2 } = await client(
      "/users",
      {
        method: "POST",
        body: data
      }
    );
    setToken(token2);
    return {
      user: user2,
      token: token2
    };
  };
  const forgotPassword = async (data) => {
    setToken(null);
    await client("/auth/forgot-password", { method: "POST", body: data });
  };
  const resetPassword = async (data) => {
    setToken(null);
    const { token: token2 } = await client(
      "/auth/reset-password",
      { method: "POST", body: data }
    );
    setToken(token2);
    const user2 = await fetchUser();
    return {
      user: user2,
      token: token2
    };
  };
  const changePassword = async (data) => {
    await client("/auth/change-password", { method: "POST", body: data });
  };
  const sendEmailConfirmation = async (data) => {
    await client("/auth/send-email-confirmation", {
      method: "POST",
      body: data
    });
  };
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
    user
  };
};
