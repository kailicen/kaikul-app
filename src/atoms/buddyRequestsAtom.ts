import { atom } from "recoil";

export type BuddyRequest = {
  id?: string;
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserEmail: string;
  fromUserPhotoURL: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: any;
  reason: string;
  gain: string;
  offer: string;
};

export const buddyRequestState = atom<BuddyRequest[]>({
  key: "buddyRequestState",
  default: [],
});
