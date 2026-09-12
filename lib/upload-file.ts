// lib/upload-file.ts
export async function uploadFileToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const errorMessage =
      typeof payload.error === "string" ? payload.error : "Failed to upload file";
    throw new Error(errorMessage);
  }

  const secureUrl =
    typeof payload.secure_url === "string" ? payload.secure_url : "";

  if (!secureUrl) {
    throw new Error("Upload succeeded but no secure URL was returned.");
  }

  return secureUrl;
}
