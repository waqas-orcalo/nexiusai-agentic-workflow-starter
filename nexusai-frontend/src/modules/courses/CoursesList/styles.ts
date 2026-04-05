export const styles = {
  wrapper: () => ({}),
  statusChip: (theme: any, status: string) => ({
    backgroundColor:
      status === 'published'
        ? theme?.palette?.success?.light
        : status === 'draft'
          ? theme?.palette?.info?.light
          : theme?.palette?.error?.light,
    color:
      status === 'published'
        ? theme?.palette?.success?.dark
        : status === 'draft'
          ? theme?.palette?.info?.dark
          : theme?.palette?.error?.dark,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 24,
  }),
  levelChip: (theme: any, level: string) => ({
    backgroundColor:
      level === 'beginner'
        ? theme?.palette?.success?.light
        : level === 'intermediate'
          ? theme?.palette?.warning?.light
          : theme?.palette?.error?.light,
    color:
      level === 'beginner'
        ? theme?.palette?.success?.dark
        : level === 'intermediate'
          ? theme?.palette?.warning?.dark
          : theme?.palette?.error?.dark,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 24,
  }),
  actionCell: () => ({
    display: 'flex',
    gap: 0.5,
  }),
};
