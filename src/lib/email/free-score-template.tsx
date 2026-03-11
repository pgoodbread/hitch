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
  Button,
} from '@react-email/components'

interface FreeScoreEmailProps {
  overall_score: number
  photo_score: number
  bio_score: number
  first_impression_score: number
  photo_teaser: string
  bio_teaser: string
  first_impression_teaser: string
  email: string
  siteUrl: string
}

function getScoreColor(score: number): string {
  if (score <= 3) return '#dc2626'
  if (score <= 6) return '#ca8a04'
  return '#16a34a'
}

function ScoreRow({
  label,
  score,
  teaser,
}: {
  label: string
  score: number
  teaser: string
}) {
  return (
    <>
      <Row style={scoreRow}>
        <Column style={scoreLabelCol}>
          <Text style={scoreLabel}>{label}</Text>
        </Column>
        <Column style={scoreValueCol}>
          <Text style={{ ...scoreValue, color: getScoreColor(score) }}>
            {score.toFixed(1)}/10
          </Text>
        </Column>
      </Row>
      <Text style={teaserText}>&ldquo;{teaser}&rdquo;</Text>
    </>
  )
}

export function FreeScoreEmail({
  overall_score,
  photo_score,
  bio_score,
  first_impression_score,
  photo_teaser,
  bio_teaser,
  first_impression_teaser,
  email,
  siteUrl,
}: FreeScoreEmailProps) {
  const ctaUrl = `${siteUrl}/optimize?email=${encodeURIComponent(email)}`

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
            <Text style={greeting}>Your profile score is in!</Text>

            {/* Overall Score */}
            <Section style={overallSection}>
              <Text style={overallLabel}>Overall Score</Text>
              <Text
                style={{
                  ...overallScore,
                  color: getScoreColor(overall_score),
                }}
              >
                {overall_score.toFixed(1)}
                <span style={outOfTen}> / 10</span>
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Category Scores */}
            <ScoreRow
              label="📸 Photos"
              score={photo_score}
              teaser={photo_teaser}
            />
            <ScoreRow label="📝 Bio" score={bio_score} teaser={bio_teaser} />
            <ScoreRow
              label="✨ First Impression"
              score={first_impression_score}
              teaser={first_impression_teaser}
            />

            <Hr style={divider} />

            {/* CTA */}
            <Text style={ctaHeading}>Want to know exactly how to fix it?</Text>
            <Text style={ctaBody}>
              Your full analysis includes photo-by-photo verdicts, an optimized
              bio ready to paste, conversation starters, and a personal action
              plan.
            </Text>
            <Section style={ctaSection}>
              <Button style={ctaButton} href={ctaUrl}>
                Unlock Full Analysis — $29
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footer}>
              Questions? Reply to this email and we&apos;ll get back to you.
            </Text>
            <Text style={footer}>
              <Link href={siteUrl} style={footerLink}>
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

const overallSection = {
  textAlign: 'center' as const,
  padding: '16px 0',
}

const overallLabel = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#64748b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 8px 0',
}

const overallScore = {
  fontSize: '48px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1',
}

const outOfTen = {
  fontSize: '24px',
  color: '#94a3b8',
  fontWeight: '400' as const,
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

const scoreRow = {
  marginBottom: '0',
}

const scoreLabelCol = {
  verticalAlign: 'middle' as const,
}

const scoreValueCol = {
  textAlign: 'right' as const,
  verticalAlign: 'middle' as const,
}

const scoreLabel = {
  fontSize: '15px',
  fontWeight: '600' as const,
  color: '#334155',
  margin: '0',
}

const scoreValue = {
  fontSize: '18px',
  fontWeight: '700' as const,
  margin: '0',
}

const teaserText = {
  fontSize: '14px',
  color: '#64748b',
  fontStyle: 'italic' as const,
  margin: '4px 0 20px 0',
}

const ctaHeading = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#1e293b',
  margin: '0 0 8px 0',
}

const ctaBody = {
  fontSize: '14px',
  color: '#475569',
  margin: '0 0 20px 0',
  lineHeight: '1.5',
}

const ctaSection = {
  textAlign: 'center' as const,
}

const ctaButton = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '14px 32px',
  borderRadius: '9999px',
  textDecoration: 'none',
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
