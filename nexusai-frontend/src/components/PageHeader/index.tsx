'use client';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { ReactNode } from 'react';
import { styles } from './styles';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

const PageHeader = ({ title, breadcrumbs, actions }: PageHeaderProps) => (
  <Box sx={styles?.wrapper()}>
    {breadcrumbs && (
      <Breadcrumbs>
        {breadcrumbs.map((item, idx) =>
          item.href ? (
            <Link key={idx} href={item.href} underline="hover" color="inherit" fontSize="0.875rem">
              {item.label}
            </Link>
          ) : (
            <Typography key={idx} color="text.primary" fontSize="0.875rem">{item.label}</Typography>
          )
        )}
      </Breadcrumbs>
    )}
    <Box sx={styles?.titleRow()}>
      <Typography sx={styles?.title()}>{title}</Typography>
      {actions && <Box>{actions}</Box>}
    </Box>
  </Box>
);

export default PageHeader;
