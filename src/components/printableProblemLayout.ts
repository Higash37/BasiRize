export type PrintableColumn<T> = {
  items: T[];
  startIndex: number;
};

// CSSの段組みに任せず、上から下へ読んだあと右列へ続くよう均等に分ける。
// 印刷エンジンがcolumn-countを無視しても、列構造と問題番号を維持できる。
export function splitIntoPrintableColumns<T>(
  items: T[],
  columnCount: number,
): PrintableColumn<T>[] {
  const safeColumnCount = Math.max(1, Math.floor(columnCount));
  const itemsPerColumn = Math.ceil(items.length / safeColumnCount);

  return Array.from({ length: safeColumnCount }, (_, columnIndex) => {
    const startIndex = columnIndex * itemsPerColumn;
    return {
      items: items.slice(startIndex, startIndex + itemsPerColumn),
      startIndex,
    };
  });
}
