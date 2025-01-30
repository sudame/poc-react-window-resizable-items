import { useEffect, useRef } from "react";
import { Item } from "./Item";
import { ListChildComponentProps, VariableSizeList } from "react-window";

/** 1文字以上1万文字以下のランダムな長さの文字列を生成する関数 */
function generateRandomString() {
  const length = Math.floor(Math.random() * 1000) + 1;
  return Array.from({ length }, () => Math.random().toString(36)[2]).join("");
}

export function App() {
  const items = Array.from({ length: 1000 }, generateRandomString);
  const variableSizeListRef = useRef<VariableSizeList>(null);
  const itemHeights = useRef<Record<number, number>>({});

  function setItemHeight(index: number, height: number) {
    if (variableSizeListRef.current != null) {
      variableSizeListRef.current.resetAfterIndex(0);
    }
    itemHeights.current = {
      ...itemHeights.current,
      [index]: height,
    };
  }

  function getItemHeight(index: number) {
    const itemHeight = itemHeights.current[index];
    if (itemHeight === undefined) {
      return 100;
    }
    return itemHeight;
  }

  function Row(rowProps: ListChildComponentProps) {
    const { index, style } = rowProps;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current != null) {
        setItemHeight(index, ref.current.clientHeight);
      }
    }, [ref, index]);

    useEffect(() => {
      if (ref.current == null) return () => {};
      const observer = new ResizeObserver(() => {
        if (ref.current == null) return;
        setItemHeight(index, ref.current.clientHeight);
      });
      observer.observe(ref.current);

      return () => observer.disconnect();
    }, [index]);

    return (
      <div style={style}>
        <Item divRef={ref}>{items[index]}</Item>
      </div>
    );
  }

  console.log(itemHeights);

  return (
    <VariableSizeList
      ref={variableSizeListRef}
      height={window.innerHeight}
      itemCount={items.length}
      itemSize={getItemHeight}
      width={"100%"}
    >
      {Row}
    </VariableSizeList>
  );
}
