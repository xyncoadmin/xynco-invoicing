import {
  Html, Head, Body, Container, Section, Row, Column,
  Text, Button, Hr, Font
} from '@react-email/components'

interface InvoiceEmailProps {
  invoiceNumber: string
  clientName: string
  total: string
  currency: string
  dueDate: string
  payUrl: string
  items: { description: string; quantity: number; rate: number; subtotal: number }[]
}

export function InvoiceEmail({ invoiceNumber, clientName, total, currency, dueDate, payUrl, items }: InvoiceEmailProps) {
  return (
    <Html>
      <Head>
        <Font fontFamily="Inter" fallbackFontFamily="Helvetica"
          webFont={{ url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', format: 'woff2' }}
          fontWeight={400} fontStyle="normal"
        />
      </Head>
      <Body style={{ background: '#F7F9FC', fontFamily: 'Inter, Helvetica, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto' }}>
          <Section style={{ background: '#ffffff', padding: '32px 40px 0' }}>
            <Row>
              <Column>
                <Text style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.04em', color: '#0A0F1E', margin: 0, lineHeight: '1.2' }}>
                  <span style={{ color: '#0099BB' }}>x</span>ynco
                </Text>
                <Text style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF', margin: '2px 0 0', lineHeight: '1' }}>AI Consulting</Text>
              </Column>
              <Column align="right">
                <Text style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: '#0A0F1E', margin: 0, lineHeight: '1.2' }}>{invoiceNumber}</Text>
                <Text style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0', lineHeight: '1' }}>Due {dueDate}</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={{ border: 'none', borderTop: '2px solid #00D4FF', margin: '0' }} />

          <Section style={{ background: '#ffffff', padding: '28px 40px' }}>
            <Text style={{ fontSize: '16px', color: '#374151', marginBottom: '8px', marginTop: 0 }}>Hi {clientName},</Text>
            <Text style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', marginTop: 0 }}>
              Please find your invoice below. Click the button to pay securely online.
            </Text>

            <Section style={{ marginTop: '24px', marginBottom: '24px' }}>
              <Row style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <Column>
                  <Text style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', padding: '8px 0', margin: 0 }}>Description</Text>
                </Column>
                <Column align="right">
                  <Text style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', padding: '8px 0', margin: 0 }}>Amount</Text>
                </Column>
              </Row>
              {items.map((item, i) => (
                <Row key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <Column>
                    <Text style={{ fontSize: '13px', color: '#374151', padding: '8px 0', margin: 0 }}>{item.description}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0A0F1E', padding: '8px 0', margin: 0 }}>${Number(item.subtotal).toFixed(2)}</Text>
                  </Column>
                </Row>
              ))}
              <Row>
                <Column>
                  <Text style={{ fontWeight: 700, fontSize: '14px', color: '#0A0F1E', margin: '12px 0 0' }}>Total</Text>
                </Column>
                <Column align="right">
                  <Text style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '18px', color: '#0099BB', margin: '12px 0 0' }}>{total} {currency}</Text>
                </Column>
              </Row>
            </Section>

            <Button
              href={payUrl}
              style={{ background: '#0099BB', color: '#ffffff', fontWeight: 700, fontSize: '14px', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
            >
              Pay {total} {currency}
            </Button>
          </Section>

          <Section style={{ background: '#F9FAFB', padding: '16px 40px', borderTop: '1px solid #E5E7EB' }}>
            <Text style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
              Secured by Stripe · xynco · sam@xynco.io
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
