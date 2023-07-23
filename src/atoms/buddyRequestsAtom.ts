import { atom } from "recoil";

export type BuddyRequest = {
  id?: string;
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserEmail: string;
  fromUserPhotoURL: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: any; // using any here because firebase.firestore.FieldValue.serverTimestamp() does not have a specific type
};

export const buddyRequestState = atom<BuddyRequest[]>({
  key: "buddyRequestState",
  default: [],
});
