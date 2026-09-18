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
  Button,
  Link,
  Img,
} from "@react-email/components";

interface AdminEmailProps {
  booking: {
    _id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    eventType: string;
    eventDate: string | Date;
    eventTime: string;
    eventLocation: string;
    eventState: string;
    eventCountry: string;
    providesFlight: boolean;
    cannotAffordFlight: boolean;
    requiresAccommodation: boolean;
    flightTicketUrl?: string | null;
    hotelTicketUrl?: string | null;
    depositReceiptUrl?: string | null;
  };
  adminUrl?: string;
}

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const AdminEmail = ({ booking, adminUrl }: AdminEmailProps) => {
  const dashboardLink = `${adminUrl || process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking._id}`;

  const isOutOfState =
    booking.eventState?.toLowerCase() !== "enugu" &&
    booking.eventCountry?.toLowerCase() === "nigeria";

  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/images/drum-logo.jpg`}
              alt="Wizzy Drums"
              width="48"
              height="48"
              style={{
                margin: "0 auto 12px",
                display: "block",
                borderRadius: "8px",
              }}
            />
            <Heading style={brandName}>Wizzy Drums</Heading>
            <Text style={brandSubtitle}>
              Professional live drumming for events that refuse to be ordinary.
            </Text>
          </Section>

          {/* Alert Badge */}
          <Section style={alertSection}>
            <Text style={alertBadge}>New Booking</Text>
            <Heading style={heading}>A new booking has been submitted</Heading>
            <Text style={subheading}>
              Review the details below and reach out to the client within 24-48
              hours.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Client Card */}
          <Section style={card}>
            <Text style={cardLabel}>CLIENT</Text>
            <Row style={row}>
              <Column style={labelCol}>Name</Column>
              <Column style={valueCol}>{booking.clientName}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Email</Column>
              <Column style={valueCol}>
                <Link href={`mailto:${booking.clientEmail}`} style={link}>
                  {booking.clientEmail}
                </Link>
              </Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Phone</Column>
              <Column style={valueCol}>
                <Link href={`tel:${booking.clientPhone}`} style={link}>
                  {booking.clientPhone}
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Event Card */}
          <Section style={card}>
            <Text style={cardLabel}>EVENT</Text>
            <Row style={row}>
              <Column style={labelCol}>Type</Column>
              <Column style={valueCol}>
                <span style={pill}>{booking.eventType}</span>
              </Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Date</Column>
              <Column style={valueCol}>{formatDate(booking.eventDate)}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Time</Column>
              <Column style={valueCol}>{booking.eventTime}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Venue</Column>
              <Column style={valueCol}>{booking.eventLocation}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelCol}>Location</Column>
              <Column style={valueCol}>
                {booking.eventState}, {booking.eventCountry}
              </Column>
            </Row>
          </Section>

          {/* Logistics Card */}
          <Section style={card}>
            <Text style={cardLabel}>LOGISTICS</Text>
            <Row style={row}>
              <Column style={labelCol}>Region</Column>
              <Column style={valueCol}>
                {isOutOfState ? (
                  <span style={pillAmber}>Out-of-State</span>
                ) : (
                  <span style={pillEmerald}>Local (Enugu)</span>
                )}
              </Column>
            </Row>

            {isOutOfState && (
              <>
                <Row style={row}>
                  <Column style={labelCol}>Flight</Column>
                  <Column style={valueCol}>
                    {booking.providesFlight
                      ? "Client provides ticket"
                      : booking.cannotAffordFlight
                        ? "Charge to quote"
                        : "Not specified"}
                  </Column>
                </Row>

                {booking.flightTicketUrl && (
                  <Row style={row}>
                    <Column style={labelCol}>Flight Doc</Column>
                    <Column style={valueCol}>
                      <Link href={booking.flightTicketUrl} style={link}>
                        View Ticket →
                      </Link>
                    </Column>
                  </Row>
                )}

                <Row style={row}>
                  <Column style={labelCol}>Hotel</Column>
                  <Column style={valueCol}>
                    {booking.requiresAccommodation
                      ? "Required"
                      : "Not required"}
                  </Column>
                </Row>

                {booking.hotelTicketUrl && (
                  <Row style={row}>
                    <Column style={labelCol}>Hotel Doc</Column>
                    <Column style={valueCol}>
                      <Link href={booking.hotelTicketUrl} style={link}>
                        View Confirmation →
                      </Link>
                    </Column>
                  </Row>
                )}
              </>
            )}

            {booking.depositReceiptUrl && (
              <Row style={row}>
                <Column style={labelCol}>Deposit</Column>
                <Column style={valueCol}>
                  <Link href={booking.depositReceiptUrl} style={link}>
                    View Receipt →
                  </Link>
                </Column>
              </Row>
            )}
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={dashboardLink} style={ctaButton}>
              Review in Dashboard
            </Button>
            <Text style={ctaHint}>
              Respond to the client within 24-48 hours
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because a booking was submitted on your
              platform.
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

export default AdminEmail;

// ============================================
// STYLES
// ============================================

const main = {
  backgroundColor: "#f4f5f7",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "32px 16px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
};

const header = {
  backgroundColor: "#0f172a",
  padding: "32px 32px 24px",
  textAlign: "center" as const,
};

const brandName = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "-0.5px",
  margin: "0",
};

const brandSubtitle = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1.5px",
  margin: "4px 0 0",
};

const alertSection = {
  padding: "32px 32px 16px",
  textAlign: "center" as const,
};

const alertBadge = {
  display: "inline-block",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "600",
  padding: "6px 14px",
  borderRadius: "999px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 16px",
};

const heading = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 8px",
};

const subheading = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
};

const divider = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "24px 32px",
};

const card = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "0 32px 16px",
  border: "1px solid #e2e8f0",
};

const cardLabel = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 12px",
};

const row = {
  padding: "4px 0",
};

const labelCol = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "500",
  width: "110px",
  verticalAlign: "top" as const,
};

const valueCol = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "500",
  verticalAlign: "top" as const,
};

const link = {
  color: "#d4a548",
  textDecoration: "none",
  fontWeight: "600",
};

const pill = {
  display: "inline-block",
  backgroundColor: "#dbeafe",
  color: "#1e40af",
  fontSize: "12px",
  fontWeight: "600",
  padding: "2px 10px",
  borderRadius: "999px",
};

const pillAmber = {
  display: "inline-block",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "600",
  padding: "2px 10px",
  borderRadius: "999px",
};

const pillEmerald = {
  display: "inline-block",
  backgroundColor: "#d1fae5",
  color: "#065f46",
  fontSize: "12px",
  fontWeight: "600",
  padding: "2px 10px",
  borderRadius: "999px",
};

const ctaSection = {
  padding: "16px 32px 24px",
  textAlign: "center" as const,
};

const ctaButton = {
  display: "inline-block",
  backgroundColor: "#d4a548",
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "700",
  padding: "14px 36px",
  borderRadius: "10px",
  textDecoration: "none",
};

const ctaHint = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "12px 0 0",
};

const footer = {
  padding: "0 32px 32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const footerSmall = {
  color: "#94a3b8",
  fontSize: "11px",
  margin: "0",
};
