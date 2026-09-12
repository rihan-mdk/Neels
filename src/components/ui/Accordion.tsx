'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import styles from './Accordion.module.css';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.item}>
      <button
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
        id={`accordion-trigger-${item.id}`}
      >
        <span className={styles.triggerTitle}>{item.title}</span>
        <span className={styles.icon} aria-hidden="true">
          {isOpen ? (
            <Minus size={14} strokeWidth={1.5} />
          ) : (
            <Plus size={14} strokeWidth={1.5} />
          )}
        </span>
      </button>
      <div
        id={`accordion-content-${item.id}`}
        role="region"
        aria-labelledby={`accordion-trigger-${item.id}`}
        className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}
        ref={contentRef}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + 'px' : '0',
        }}
      >
        <div className={styles.contentInner}>{item.content}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
