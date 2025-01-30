import { ReactNode, Ref } from "react";
import styles from "./Item.module.css";

interface Props {
  children: ReactNode;
  divRef: Ref<HTMLDivElement>;
}

export function Item(props: Props) {
  const { children, divRef } = props;
  return (
    <div ref={divRef} className={styles.item}>
      {children}
    </div>
  );
}
