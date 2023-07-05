import { atom, DefaultValue, selectorFamily } from "recoil";

export type Blocker = {
  id?: string;
  text: string;
  date: string;
  userId: string | null;
};

interface BlockerState {
  [date: string]: Blocker[];
}

export const blockerState = atom<BlockerState>({
  key: "blockerState",
  default: {},
});

export const blockerListState = selectorFamily<Blocker[], string>({
  key: "BlockerList",
  get:
    (day) =>
    ({ get }) => {
      const blockerStateVal = get(blockerState);
      return blockerStateVal[day] || [];
    },
  set:
    (day) =>
    ({ set }, newValue) => {
      set(blockerState, (oldBlockerState) => {
        const updatedBlockerState = { ...oldBlockerState };
        updatedBlockerState[day] =
          newValue instanceof DefaultValue ? [] : newValue;
        return updatedBlockerState;
      });
    },
});
