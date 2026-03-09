import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ShortUrl {
    clicks: bigint;
    originalUrl: string;
    code: string;
    createdAt: bigint;
}
export interface Registration {
    id: string;
    teamName: string;
    proofOfPaymentUrl?: ExternalBlob;
    whatsappLink: string;
    playerPhotoUrl?: ExternalBlob;
    referredBy?: string;
    paymentScreenshotUrl?: ExternalBlob;
    response: string;
    phoneNumber: string;
    registeredAt: bigint;
    teamLogoUrl?: ExternalBlob;
}
export interface backendInterface {
    createRegistration(teamName: string, response: string, phoneNumber: string, whatsappLink: string, teamLogoUrl: ExternalBlob | null, playerPhotoUrl: ExternalBlob | null, paymentScreenshotUrl: ExternalBlob | null, proofOfPaymentUrl: ExternalBlob | null, referredBy: string | null): Promise<Registration>;
    createShortUrl(code: string, originalUrl: string): Promise<ShortUrl | null>;
    deleteAllRegistrations(): Promise<bigint>;
    deleteRegistration(id: string): Promise<boolean>;
    deleteShortUrl(code: string): Promise<boolean>;
    getRegistration(id: string): Promise<Registration | null>;
    getRegistrationCount(): Promise<bigint>;
    listRegistrations(): Promise<Array<Registration>>;
    listShortUrls(): Promise<Array<ShortUrl>>;
    resetRegistrations(): Promise<bigint>;
    resolveShortUrl(code: string): Promise<string | null>;
}
