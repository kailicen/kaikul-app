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
  senderReason: string; // Reason from the sender (previously 'reason')
  recipientResponse?: string; // Reason or response from the recipient when they accept/reject
};

export const buddyRequestState = atom<BuddyRequest[]>({
  key: "buddyRequestState",
  default: [],
});

export type Message = {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: any;
  isRead: boolean;
  senderName?: string;
  senderPhotoURL?: string;
  unreadCount?: number;
};

export const messagesAtom = atom<Message[]>({
  key: "messagesAtom",
  default: [],
});

export const unreadMessagesAtom = atom<Message[]>({
  key: "unreadMessagesAtom",
  default: [],
});

export const readMessagesAtom = atom<Message[]>({
  key: "readMessagesAtom",
  default: [],
});

export type AppUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  [key: string]: any;
};

export type Buddy = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string; // URL of the avatar image
};

export const buddyListState = atom<Buddy[]>({
  key: "buddyListState",
  default: [],
});
