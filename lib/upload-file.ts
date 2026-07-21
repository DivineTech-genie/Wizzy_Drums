// lib/upload-file.ts
export async function uploadFileToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload file");
  }

  const data = await response.json();
  return data.secure_url; // Cloudinary returns the URL
}
