import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import { HeadCell } from '../Card';

interface EnhancedTableProps {
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    numSelected: number;
    rowCount: number;
}
export function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, rowCount } = props;
    const headCells: readonly HeadCell[] = [
        {
            id: 'cloth_name',
            numeric: false,
            disablePadding: true,
            label: 'Item description',
        },
        {
            id: 'cloth_status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
        },
        {
            id: 'washing_price',
            numeric: true,
            disablePadding: false,
            label: 'Unit price',
        },
        {
            id: 'quantity',
            numeric: true,
            disablePadding: false,
            label: 'Quantity',
        },
        {
            id: 'total',
            numeric: true,
            disablePadding: false,
            label: 'Total',
        },
    ];

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }} />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
