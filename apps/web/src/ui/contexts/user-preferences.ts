import { trpc } from "@rallly/backend";

import { useDayjs } from "@/utils/dayjs";

export const useUserPreferences = () => {
  const { dayjs, timeFormat, weekStartsOn } = useDayjs();
  const { data } = trpc.user.preferences.get.useQuery();
  const isDirty = !!data;
  return {
    language: "en",
    timeFormat,
    weekStart: weekStartsOn === "sunday" ? 0 : 1,
    preferredTimeZone: dayjs.tz.guess(),
    isDirty,
    ...data,
  };
};
