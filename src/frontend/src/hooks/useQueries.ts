import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, type Registration, type ShortUrl } from "../backend";
import { useActor } from "./useActor";

export function useListRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegistrationCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["registrationCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRegistrationCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface CreateRegistrationParams {
  teamName: string;
  response: string;
  phoneNumber: string;
  whatsappLink: string;
  teamLogoFile: File | null;
  playerPhotoFile: File | null;
  paymentScreenshotFile: File | null;
  proofOfPaymentFile: File | null;
  referredBy: string | null;
}

export function useDeleteRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deleteRegistration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationCount"] });
    },
  });
}

export function useDeleteAllRegistrations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not available");
      return actor.deleteAllRegistrations();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationCount"] });
    },
  });
}

export function useResetRegistrations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not available");
      return actor.resetRegistrations();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationCount"] });
    },
  });
}

// ── Short URL hooks ───────────────────────────────────────────

function generateCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useListShortUrls() {
  const { actor, isFetching } = useActor();
  return useQuery<ShortUrl[]>({
    queryKey: ["shortUrls"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listShortUrls();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface CreateShortUrlParams {
  originalUrl: string;
}

export function useCreateShortUrl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ShortUrl, Error, CreateShortUrlParams>({
    mutationFn: async ({ originalUrl }) => {
      if (!actor) throw new Error("Backend not available");
      const code = generateCode();
      const result = await actor.createShortUrl(code, originalUrl);
      if (!result) throw new Error("Failed to create short URL");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortUrls"] });
    },
  });
}

export function useDeleteShortUrl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deleteShortUrl(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortUrls"] });
    },
  });
}

export function useCreateRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Registration, Error, CreateRegistrationParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Backend not available");

      const toBlob = async (
        file: File | null,
      ): Promise<ExternalBlob | null> => {
        if (!file) return null;
        const bytes = new Uint8Array(await file.arrayBuffer());
        return ExternalBlob.fromBytes(bytes);
      };

      const [
        teamLogoUrl,
        playerPhotoUrl,
        paymentScreenshotUrl,
        proofOfPaymentUrl,
      ] = await Promise.all([
        toBlob(params.teamLogoFile),
        toBlob(params.playerPhotoFile),
        toBlob(params.paymentScreenshotFile),
        toBlob(params.proofOfPaymentFile),
      ]);

      return actor.createRegistration(
        params.teamName,
        params.response,
        params.phoneNumber,
        params.whatsappLink,
        teamLogoUrl,
        playerPhotoUrl,
        paymentScreenshotUrl,
        proofOfPaymentUrl,
        params.referredBy,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationCount"] });
    },
  });
}
