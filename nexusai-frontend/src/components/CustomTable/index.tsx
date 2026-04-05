'use client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, Box, Typography, Skeleton,
  TablePagination,
} from '@mui/material';
import { ReactNode } from 'react';
import { styles } from './styles';

export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  render?: (row: any) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface CustomTableProps {
  columns: TableColumn[];
  rows: any[];
  loading?: boolean;
  selectable?: boolean;
  selected?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string) => void;
  getRowId?: (row: any) => string;
  page?: number;
  rowsPerPage?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  emptyMessage?: string;
}

const CustomTable = ({
  columns,
  rows,
  loading = false,
  selectable = false,
  selected = [],
  onSelectAll,
  onSelectRow,
  getRowId = (row) => row._id,
  page = 0,
  rowsPerPage = 10,
  totalRecords = 0,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = 'No records found.',
}: CustomTableProps) => {
  const skeletonRows = Array.from({ length: rowsPerPage });

  return (
    <Paper sx={styles?.container()}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ ...styles?.headerCell(), minWidth: col.minWidth, textAlign: col.align || 'left' }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              skeletonRows.map((_, idx) => (
                <TableRow key={idx}>
                  {selectable && <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>}
                  {columns.map((col) => (
                    <TableCell key={col.id}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectable ? columns.length + 1 : columns.length} sx={styles?.emptyCell()}>
                  <Box>
                    <Typography variant="body2">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const rowId = getRowId(row);
                const isSelected = selected.includes(rowId);
                return (
                  <TableRow key={rowId} sx={styles?.tableRow()} selected={isSelected}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => onSelectRow?.(rowId)} />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align || 'left'}>
                        {col.render ? col.render(row) : row[col.id] ?? '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRecords > 0 && (
        <TablePagination
          component="div"
          count={totalRecords}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => onPageChange?.(p)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(+e.target.value)}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default CustomTable;
