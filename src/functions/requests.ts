import requestProvider from "./requestProvider";

export const userSync = async (token: string) => {
  const res: any = await requestProvider(
    "/general/users/sync",
    "GET",
    {},
    { Authorization: `Bearer ${token}` }
  );

  return res.data;
};

export const userRequests = {
  getAllUsers: async () => {
    const res: any = await requestProvider("/general/users", "GET");

    return res.data;
  },

  /**
   *
   * AUTH REQUESTS
   *
   */

  registerOwner: async (
    fullName: string,
    password: string,
    role: string,
    email: string
  ) => {
    const res: any = await requestProvider(
      "/general/users/auth/register",
      "POST",
      {
        fullName,
        password,
        role,
        email,
      }
    );

    return res.data;
  },
  registerWorker: async (
    fullName: string,
    password: string,
    role: string,
    email: string,
    storeIdentifier: string,
    storeName: string
  ) => {
    const res: any = await requestProvider(
      "/general/users/auth/register",
      "POST",
      {
        fullName,
        password,
        role,
        email,
        storeIdentifier,
        storeName,
      }
    );

    return res.data;
  },
  login: async (email: string, password: string) => {
    const res: any = await requestProvider(
      "/general/users/auth/login",
      "POST",
      { email, password }
    );

    return res.data;
  },
  logout: async (refreshId: string, token: string) => {
    const res: any = await requestProvider(
      "/general/users/auth/logout",
      "POST",
      { refreshId },
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },

  // Delete Request

  deleteUser: async (refreshId: string, token: string) => {
    const res: any = await requestProvider(
      "/general/users/",
      "DELETE",
      { refreshId },
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },

  // Get User Object

  userObject: async (token: string) => {
    const res: any = await requestProvider(
      "/general/users/object",
      "GET",
      {},
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },

  // Accept Worker

  acceptWorker: async (workerId: string, judge: string, token: string) => {
    const res: any = await requestProvider(
      "/general/users/accept",
      "POST",
      {
        workerId,
        judge,
      },
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },
};

export const storeRequests = {
  addStore: async (token: string, name: string, locations: string[]) => {
    const res: any = await requestProvider(
      "/general/stores",
      "POST",
      { name, locations },
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },
  getAllStores: async () => {
    const res: any = await requestProvider("/general/stores/", "GET", {}, {});

    return res.data;
  },
  deleteStore: async (storeId: string, token: string) => {
    const res: any = await requestProvider(
      `/general/stores/${storeId}`,
      "DELETE",
      {},
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },
  getStoreByID: async (id: string | undefined, token: string) => {
    const res: any = await requestProvider(
      `/general/stores/${id}`,
      "GET",
      {},
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },
};

export const transactionRequests = {
  createTransaction: async (
    token: string | undefined,
    amount: string | undefined,
    method: string | undefined,
    location: string | undefined,
    storeName: string | undefined,
    item: string | undefined
  ) => {
    const res: any = await requestProvider(
      `/general/transactions`,
      "POST",
      { amount, method, item, location, storeName },
      { Authorization: `Bearer ${token}` }
    );

    return res.data;
  },
};
