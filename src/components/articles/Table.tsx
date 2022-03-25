import { Table } from '@nextui-org/react';

export const buildTable = (data: any) => {
  const { rows, value } = data;
  // TODO: table_block_column_format で cellの幅が取得できる
  // TODO: table_block_row_header もある
  const {
    table_block_column_order: order,
    table_block_column_header: hasHeader
  } = value.format;
  const contentRows = hasHeader ? rows.slice(1) : rows;
  return (
    <Table
      aria-label={`table:${value.id}`}
      bordered
      sticked
      lined
      shadow={false}
      containerCss={{
        borderRadius: '$xs',
        marginBottom: '$12'
      }}
      css={{
        tableLayout: 'fixed',
        height: 'auto',
        minWidth: '100%'
      }}
    >
      <Table.Header>
        {order.map(o => (
          <Table.Column
            css={{
              display: hasHeader ? 'table-cell' : 'none',
              borderRadius: '0!important'
            }}
            key={o}
          >
            {rows[0].properties[o]}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body>
        {contentRows.map(row => (
          <Table.Row key={row.id}>
            {order.map(o => (
              <Table.Cell key={o} css={{ whiteSpace: 'pre-wrap' }}>
                {row.properties[o]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
