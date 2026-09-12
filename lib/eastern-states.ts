export const  easternStates = ["enugu", "abia", "anambra", "ebonyi", "imo"];

export const isEasternNigeriaState = (state: string) => {
  if (!state) return false;
  const lower = state.trim().toLowerCase();
  return easternStates.some((s) => lower.includes(s));
};
