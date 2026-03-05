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
}

export function ReportEmail({ reportHtml }: ReportEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column style={logoColumn}>
                <Img src="cid:logo" alt="Logo" height="64" style={logoImage} />
              </Column>
              <Column>
                <Text style={headerText}>Tinder Profile Optimizer</Text>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Your profile optimization is ready!</Text>

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

const logoColumn = {
  width: '76px',
  verticalAlign: 'middle' as const,
}

const logoImage = {
  display: 'block' as const,
}

const headerText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600' as const,
  margin: '0',
  paddingLeft: '12px',
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
