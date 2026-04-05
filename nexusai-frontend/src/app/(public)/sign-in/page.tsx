'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import { Close, AutoAwesome, SmartToy } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { styles } from './styles';

const SignInPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  // Sign-in form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  return (
    <Box sx={styles.overlay()}>
      <Box sx={styles.modal()}>
        {/* Left Panel */}
        <Box sx={styles.leftPanel()}>
          <Box sx={styles.leftLogo()}>
            <Box sx={styles.leftLogoIcon()}>
              <AutoAwesome sx={{ color: '#fff', fontSize: 14 }} />
            </Box>
            <Typography sx={styles.leftLogoText()}>NexusAI</Typography>
          </Box>
          <SmartToy sx={styles.robotIcon()} />
          <Typography sx={styles.leftHeading()}>Build Smarter with AI Agents</Typography>
          <Typography sx={styles.leftSubtitle()}>
            Access 525+ models, create custom agents, and automate your workflow — all in one
            platform.
          </Typography>
          {[
            '525+ AI models from 30+ labs',
            'Custom agent builder with any model',
            'Connect tools, memory & APIs',
            'Real-time analytics & monitoring',
          ].map((feat, i) => (
            <Box key={i} sx={styles.featureBullet()}>
              <Box sx={styles.bulletDot()} />
              <Typography sx={styles.bulletText()}>{feat}</Typography>
            </Box>
          ))}
        </Box>

        {/* Right Panel */}
        <Box sx={styles.rightPanel()}>
          <IconButton
            sx={styles.closeBtn()}
            onClick={() => router.push('/home')}>
            <Close />
          </IconButton>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={styles.tabs()}>
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {tab === 0 ? (
            <Box sx={styles.form()}>
              <Typography variant="h5" sx={styles.formHeading()}>
                Welcome back
              </Typography>
              <Typography sx={styles.formSubtitle()}>
                Sign in to your NexusAI account to continue.
              </Typography>
              <TextField
                fullWidth
                label="Email address"
                placeholder="you@company.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                sx={styles.field()}
              />
              <TextField
                fullWidth
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                sx={styles.field()}
              />
              <Typography sx={styles.forgotLink()}>Forgot password?</Typography>
              <Button fullWidth variant="contained" sx={styles.submitBtn()}>
                Sign in
              </Button>
              <Divider sx={styles.divider()}>Or continue with</Divider>
              <Box sx={styles.oauthRow()}>
                {['Google', 'GitHub', 'Microsoft'].map((p) => (
                  <Button key={p} variant="outlined" sx={styles.oauthBtn()}>
                    {p}
                  </Button>
                ))}
              </Box>
              <Typography sx={styles.switchText()}>
                Don&apos;t have an account?{' '}
                <Box component="span" sx={styles.switchLink()} onClick={() => setTab(1)}>
                  Create one →
                </Box>
              </Typography>
            </Box>
          ) : (
            <Box sx={styles.form()}>
              <Typography variant="h5" sx={styles.formHeading()}>
                Create your account
              </Typography>
              <Typography sx={styles.formSubtitle()}>Join 82K builders on NexusAI.</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={styles.field()}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={styles.field()}
                />
              </Box>
              <TextField
                fullWidth
                label="Email address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                sx={styles.field()}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                sx={styles.field()}
              />
              <Button fullWidth variant="contained" sx={styles.submitBtn()}>
                Create account
              </Button>
              <Typography sx={styles.switchText()}>
                Already have an account?{' '}
                <Box component="span" sx={styles.switchLink()} onClick={() => setTab(0)}>
                  Sign in
                </Box>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
