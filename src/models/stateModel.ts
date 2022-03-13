import User from "./userModel";

export interface State {
  token: string;
  refreshId: string;
  user: User;
  verified: boolean;
}
