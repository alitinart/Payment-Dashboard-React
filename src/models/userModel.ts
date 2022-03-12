import { Store } from "./storeModel";

export default interface User {
  _id: string;
  fullName: string;
  email: string;
  stores: Store[];
  store?: Store;
  role: string;
}
