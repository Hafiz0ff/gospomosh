import { supabase } from "@/lib/supabase";

export const BUCKET_NAME = "client-documents";

/**
 * Uploads a document to the private Supabase Storage bucket
 * Path: client-documents/{client_id}/{category}/{filename}
 */
export async function uploadClientDocument(
  clientId: string,
  category: "passports" | "tax" | "family" | "immigration" | "other",
  file: File
): Promise<{ path: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${clientId}/${category}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      return { path: "", error: error.message };
    }

    return { path: filePath };
  } catch (err: any) {
    return { path: "", error: err.message || "Ошибка загрузки файла" };
  }
}

/**
 * Creates a short-lived Signed URL for secure download/preview (5 minutes / 300 seconds)
 */
export async function getDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds: number = 300
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data) {
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    return null;
  }
}

/**
 * Deletes a document file from the private bucket
 */
export async function deleteStorageDocument(storagePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    return !error;
  } catch (err) {
    return false;
  }
}
