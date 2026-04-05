'use client';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import useAuth from '@/hooks/useAuth';
import { styles } from './styles';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Box sx={styles?.wrapper()}>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Welcome back, {user?.firstName} {user?.lastName}!
      </Typography>

      <Grid container spacing={2} sx={styles?.statsGrid()}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles?.card()}>
            <CardContent sx={styles?.cardContent()}>
              <Typography sx={styles?.statValue()}>0</Typography>
              <Typography sx={styles?.statLabel()}>Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles?.card()}>
            <CardContent sx={styles?.cardContent()}>
              <Typography sx={styles?.statValue()}>0</Typography>
              <Typography sx={styles?.statLabel()}>Total Courses</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles?.card()}>
            <CardContent sx={styles?.cardContent()}>
              <Typography sx={styles?.statValue()}>0</Typography>
              <Typography sx={styles?.statLabel()}>Active Courses</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={styles?.card()}>
            <CardContent sx={styles?.cardContent()}>
              <Typography sx={styles?.statValue()}>0</Typography>
              <Typography sx={styles?.statLabel()}>Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
