import type { Metadata } from "next";
import UploadsPage from "@/components/AdminUpload";

export const metadata: Metadata = {
  title: "Uploads | Wizzy Drums",
  description:
    "View and manage media uploads for events, gallery content, and promotional assets with Wizzy Drums.",
  robots: {
    index: false,
    follow: false,
  },
};

const Uploads = () => {
  return (
    <div>
      <UploadsPage />
    </div>
  );
};

export default Uploads;
