'use client';
import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { styles } from './styles';

const LANGUAGES = [
  { code: 'EN', label: '🇺🇸 English' },
  { code: 'AR', label: '🇸🇦 العربية' },
  { code: 'FR', label: '🇫🇷 Français' },
  { code: 'DE', label: '🇩🇪 Deutsch' },
  { code: 'ES', label: '🇪🇸 Español' },
  { code: 'PT', label: '🇧🇷 Português' },
  { code: 'ZH', label: '🇨🇳 中文' },
  { code: 'JA', label: '🇯🇵 日本語' },
  { code: 'KO', label: '🇰🇷 한국어' },
  { code: 'HI', label: '🇮🇳 हिन्दी' },
  { code: 'UR', label: '🇵🇰 اردو' },
  { code: 'TR', label: '🇹🇷 Türkçe' },
  { code: 'RU', label: '🇷🇺 Русский' },
  { code: 'IT', label: '🇮🇹 Italiano' },
  { code: 'NL', label: '🇳🇱 Nederlands' },
];

const NAV_LINKS = [
  { label: 'Chat Hub', href: '/chat' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Discover New', href: '/discover' },
  { label: 'Agents', href: '/agents' },
];

const Navbar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('EN');
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box component="nav" sx={styles?.nav()}>
      {/* Logo */}
      <Box sx={styles?.logo()}>
        <Box sx={styles?.logoMark()}>
          <svg viewBox="0 0 14 14" style={{ width: 14, height: 14, fill: 'white' }}>
            <path d="M7 1 L13 7 L7 13 L1 7 Z" />
          </svg>
        </Box>
        NexusAI
      </Box>

      {/* Nav Links */}
      <Box component="ul" sx={styles?.navLinks()}>
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Box component="a" href={link.href} sx={styles?.navLink()}>
              {link.label}
            </Box>
          </li>
        ))}
      </Box>

      {/* Nav Actions */}
      <Box sx={styles?.navActions()}>
        {/* Language Selector */}
        <Box ref={langRef} sx={{ position: 'relative' }}>
          <Box
            component="button"
            sx={styles?.langBtn()}
            onClick={() => setLangOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{activeLang}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 10, height: 10, flexShrink: 0 }}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Box>

          {langOpen && (
            <Box sx={styles?.langMenu()}>
              <Box sx={styles?.langMenuHead()}>App Language</Box>
              {LANGUAGES.map((lang) => (
                <Box
                  component="button"
                  key={lang.code}
                  sx={{
                    ...styles?.langOpt(),
                    background: activeLang === lang.code ? 'var(--accent-lt)' : 'none',
                    color: activeLang === lang.code ? 'var(--accent)' : 'var(--text2)',
                    '&:hover': { background: 'var(--bg2)', color: 'var(--text)' },
                  }}
                  onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                >
                  {lang.label}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Sign In */}
        <Box
          component="button"
          sx={styles?.btnGhost()}
          onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
        >
          Sign in
        </Box>

        {/* Get Started */}
        <Box
          component="button"
          sx={styles?.btnPrimary()}
          onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent2)'; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
        >
          Get Started →
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
