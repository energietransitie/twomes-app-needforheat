import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { activateAccount } from "@/api/account";

type ReactQueryOptions = Omit<
  UseMutationOptions<Awaited<ReturnType<typeof activateAccount>>, unknown, { accountToken: string, latitude?: number, longtitude?: number, tz_name?: string }, unknown>,
  "mutationFn"
>;

export default function useActivateAccount(options: ReactQueryOptions = {}) {
  return useMutation(
    async ({ accountToken, latitude, longtitude, tz_name }) => {
      return activateAccount(accountToken, latitude, longtitude, tz_name);
    },
    options
  );
}


