import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface BookingConfirmationProps {
  clientName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  status: "pending" | "confirmed" | "cancelled";
  adminNote?: string;
  eventTime?: string;
}

export const BookingConfirmation = ({
  clientName,
  eventType,
  eventDate,
  eventLocation,
  status,
  adminNote,
  eventTime,
}: BookingConfirmationProps) => {
  // Status-specific content
  const getStatusContent = () => {
    switch (status) {
      case "pending":
        return {
          subject: "Booking Request Received 🎵",
          heading: "We've Received Your Booking Request!",
          intro: `Thank you ${clientName} for your interest in booking us for your event!`,
          message:
            "Our team is reviewing your request and will get back to you within 24-48 hours with a personalized quote and availability confirmation.",
          buttonText: "View Your Request",
          buttonColor: "#f59e0b", // amber
        };
      case "confirmed":
        return {
          subject: "Booking Confirmed! 🎉",
          heading: "Your Booking is Confirmed!",
          intro: `Dear ${clientName}, we're thrilled to confirm your booking!`,
          message:
            "Everything is locked in for your event. We're looking forward to performing and making your event unforgettable.",
          buttonText: "View Booking Details",
          buttonColor: "#10b981", // emerald
        };
      case "cancelled":
        return {
          subject: "Booking Cancelled",
          heading: "Booking Cancelled",
          intro: `Dear ${clientName}, this is to confirm that your booking has been cancelled.`,
          message:
            "We understand that plans change. If you'd like to reschedule or have any questions, please don't hesitate to reach out.",
          buttonText: "Contact Us",
          buttonColor: "#ef4444", // red
        };
      default:
        return {
          subject: "Booking Update",
          heading: "Booking Update",
          intro: `Dear ${clientName},`,
          message: "Your booking has been updated.",
          buttonText: "View Details",
          buttonColor: "#3b82f6", // blue
        };
    }
  };

  const content = getStatusContent();

  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          {/* Header with logo placeholder */}
          <Section style={headerSection}>
            <Heading style={headerTitle}>Wizzy Drums</Heading>
            <Text style={headerSubtitle}>Professional Event Entertainment</Text>
          </Section>

          <Hr style={hr} />

          {/* Status Badge */}
          <Section style={statusBadgeContainer}>
            <Text
              style={{
                ...statusBadge,
                backgroundColor:
                  status === "confirmed"
                    ? "#d1fae5"
                    : status === "cancelled"
                      ? "#fee2e2"
                      : "#fef3c7",
                color:
                  status === "confirmed"
                    ? "#065f46"
                    : status === "cancelled"
                      ? "#991b1b"
                      : "#92400e",
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={heading}>{content.heading}</Heading>

            <Text style={paragraph}>{content.intro}</Text>

            <Text style={paragraph}>{content.message}</Text>

            {/* Event Details Card */}
            <Section style={detailsCard}>
              <Heading style={detailsTitle}>📋 Event Details</Heading>
              <Row style={detailRow}>
                <Column style={detailLabel}>Event Type</Column>
                <Column style={detailValue}>{eventType}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Date</Column>
                <Column style={detailValue}>{eventDate}</Column>
              </Row>
              {eventTime && (
                <Row style={detailRow}>
                  <Column style={detailLabel}>Time</Column>
                  <Column style={detailValue}>{eventTime}</Column>
                </Row>
              )}
              <Row style={detailRow}>
                <Column style={detailLabel}>Location</Column>
                <Column style={detailValue}>{eventLocation}</Column>
              </Row>
            </Section>

            {/* Admin Note (if provided) */}
            {adminNote && (
              <Section style={noteSection}>
                <Text style={noteLabel}>📝 Note from our team:</Text>
                <Text style={noteContent}>&quot;{adminNote}&quot;</Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonSection}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/book/success`}
                style={{
                  ...button,
                  backgroundColor: content.buttonColor,
                }}
              >
                {content.buttonText}
              </a>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Need to make changes? Contact us at{" "}
              <a href="mailto:wisdomchukwu606@gmail.com" style={footerLink}>
                wisdomchukwu606@gmail.com
              </a>
            </Text>
            <Text style={footerSmall}>
              © {new Date().getFullYear()} Wizzy Drums. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmation;

// ============================================
// STYLES
// ============================================

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  maxWidth: "580px",
  padding: "40px 30px",
};

const headerSection = {
  textAlign: "center" as const,
  paddingBottom: "16px",
};

const headerTitle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#1a1a2e",
  marginBottom: "4px",
};

const headerSubtitle = {
  fontSize: "14px",
  color: "#6b7280",
  marginTop: "0",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "20px 0",
};

const statusBadgeContainer = {
  textAlign: "center" as const,
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 16px",
  borderRadius: "9999px",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const contentSection = {
  padding: "8px 0",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1a1a2e",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  marginBottom: "16px",
};

const detailsCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid #e5e7eb",
};

const detailsTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a2e",
  marginBottom: "12px",
};

const detailRow = {
  padding: "6px 0",
};

const detailLabel = {
  fontSize: "14px",
  color: "#6b7280",
  fontWeight: "500",
  width: "120px",
};

const detailValue = {
  fontSize: "14px",
  color: "#1a1a2e",
  fontWeight: "500",
};

const noteSection = {
  backgroundColor: "#fef9e7",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "20px",
  border: "1px solid #fdebb0",
};

const noteLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#92400e",
  marginBottom: "4px",
};

const noteContent = {
  fontSize: "15px",
  color: "#78350f",
  fontStyle: "italic" as const,
  marginTop: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  paddingTop: "8px",
};

const button = {
  display: "inline-block",
  padding: "12px 32px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  textDecoration: "none",
  transition: "background-color 0.2s",
};

const footerSection = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "8px",
};

const footerLink = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footerSmall = {
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "8px",
};
