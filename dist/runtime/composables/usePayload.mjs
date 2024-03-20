import { usePayloadClient } from "./usePayloadClient.mjs";
export const usePayload = () => {
  const client = usePayloadClient();
  const find = (contentType, params, fetchOptions) => {
    return client(`/${contentType}`, { method: "GET", params, ...fetchOptions });
  };
  const findOne = (contentType, id, params, fetchOptions) => {
    if (typeof id === "object") {
      params = id;
      id = void 0;
    }
    const path = [contentType, id].filter(Boolean).join("/");
    return client(path, { method: "GET", params, ...fetchOptions });
  };
  const create = (contentType, data) => {
    return client(`/${contentType}`, { method: "POST", body: { data } });
  };
  const update = (contentType, id, data) => {
    if (typeof id === "object") {
      data = id;
      id = void 0;
    }
    const path = [contentType, id].filter(Boolean).join("/");
    return client(path, { method: "PUT", body: { data } });
  };
  const _delete = (contentType, id) => {
    const path = [contentType, id].filter(Boolean).join("/");
    return client(path, { method: "DELETE" });
  };
  return {
    find,
    findOne,
    create,
    update,
    delete: _delete
  };
};
