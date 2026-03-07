import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, type Registration } from "../backend";
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
