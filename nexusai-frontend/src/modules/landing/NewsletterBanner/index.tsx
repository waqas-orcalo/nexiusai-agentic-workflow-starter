'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import { styles } from './styles';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <Box component="section" sx={styles?.section()}>
      <Box sx={styles?.inner()}>
        <Box sx={styles?.eyebrow()}>Stay ahead of the curve</Box>
        <Box component="h2" sx={styles?.heading()}>
          New models drop every week.<br />Don&apos;t miss a release.
        </Box>
        <Box sx={styles?.subtitle()}>
          Get a curated weekly digest: new model releases, benchmark comparisons, pricing changes, and prompt engineering tips — straight to your inbox.
        </Box>

        {submitted ? (
          <Box sx={{ color: 'var(--teal-lt)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            ✅ You&apos;re subscribed! Welcome to NexusAI Weekly.
          </Box>
        ) : (
          <Box sx={styles?.formRow()}>
            <Box
              component="input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              sx={styles?.input()}
            />
            <Box
              component="button"
              onClick={handleSubmit}
              sx={styles?.submitBtn()}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent2)'; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
            >
              Subscribe free →
            </Box>
          </Box>
        )}

        <Box sx={styles?.disclaimer()}>
          No spam. Unsubscribe any time. Trusted by 82K+ builders.
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterBanner;
