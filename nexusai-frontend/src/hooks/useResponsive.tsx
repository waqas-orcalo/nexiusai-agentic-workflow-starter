import { useTheme, useMediaQuery } from '@mui/material';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type QueryType = 'up' | 'down' | 'between' | 'only';

const useResponsive = (query: QueryType, key: BreakpointKey, start?: BreakpointKey, end?: BreakpointKey): boolean => {
  const theme = useTheme();
  const mediaUp = useMediaQuery(theme.breakpoints.up(key));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start || 'sm', end || 'md'));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(key));

  if (query === 'up') return mediaUp;
  if (query === 'down') return mediaDown;
  if (query === 'between') return mediaBetween;
  return mediaOnly;
};

export default useResponsive;
