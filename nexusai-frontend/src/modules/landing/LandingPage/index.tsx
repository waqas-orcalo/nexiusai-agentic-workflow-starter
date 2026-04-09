import { Box } from '@mui/material';
import Navbar from '@/modules/landing/Navbar';
import HeroSection from '@/modules/landing/HeroSection';
import FeaturedModels from '@/modules/landing/FeaturedModels';
import BuiltForBuilders from '@/modules/landing/BuiltForBuilders';
import BrowseByLab from '@/modules/landing/BrowseByLab';
import ModelComparisonTable from '@/modules/landing/ModelComparisonTable';
import TrendingThisWeek from '@/modules/landing/TrendingThisWeek';
import FindByBudget from '@/modules/landing/FindByBudget';
import QuickStartUseCases from '@/modules/landing/QuickStartUseCases';
import NewsletterBanner from '@/modules/landing/NewsletterBanner';
import LandingFooter from '@/modules/landing/LandingFooter';
import { styles } from './styles';

const LandingPage = () => (
  <Box sx={styles?.page()}>
    <Navbar />
    <HeroSection />
    <FeaturedModels />
    <BuiltForBuilders />
    <BrowseByLab />
    <ModelComparisonTable />
    <TrendingThisWeek />
    <FindByBudget />
    <QuickStartUseCases />
    <NewsletterBanner />
    <LandingFooter />
  </Box>
);

export default LandingPage;
