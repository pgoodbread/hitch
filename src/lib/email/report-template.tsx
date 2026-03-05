import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Img,
  Row,
  Column,
} from '@react-email/components'

interface ReportEmailProps {
  reportHtml: string // Must be pre-sanitized by the caller
  photoCount?: number
}

export function ReportEmail({ reportHtml, photoCount = 0 }: ReportEmailProps) {
  const photos = Array.from({ length: photoCount }, (_, i) => i + 1)

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>Tinder Profile Optimizer</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Your profile optimization is ready!</Text>

            {photoCount > 0 && (
              <>
                <Text style={sectionTitle}>Your Photos</Text>
                <Row>
                  {photos.map((num) => (
                    <Column key={num} style={photoColumn}>
                      <Img
                        src={`cid:photo${num}`}
                        alt={`Photo ${num}`}
                        width="120"
                        style={photoImage}
                      />
                      <Text style={photoLabel}>Photo {num}</Text>
                    </Column>
                  ))}
                </Row>
                <Hr style={divider} />
              </>
            )}

            <div dangerouslySetInnerHTML={{ __html: reportHtml }} />

            <Hr style={divider} />

            <Text style={footer}>
              Questions? Reply to this email and we&apos;ll get back to you.
            </Text>
            <Text style={footer}>
              <Link
                href="https://tinderprofileoptimizer.com"
                style={footerLink}
              >
                tinderprofileoptimizer.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden' as const,
}

const header = {
  backgroundColor: '#2563eb',
  padding: '24px 32px',
}

const headerText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600' as const,
  margin: '0',
}

const content = {
  padding: '32px',
}

const greeting = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#1e293b',
  marginBottom: '24px',
}

const sectionTitle = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#334155',
  marginBottom: '12px',
}

const photoColumn = {
  padding: '0 8px 0 0',
  verticalAlign: 'top' as const,
}

const photoImage = {
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
}

const photoLabel = {
  fontSize: '12px',
  color: '#64748b',
  textAlign: 'center' as const,
  margin: '4px 0 0 0',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '4px 0',
}

const footerLink = {
  color: '#2563eb',
  textDecoration: 'none',
}
