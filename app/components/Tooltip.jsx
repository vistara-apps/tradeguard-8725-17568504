    'use client';

    import { useState } from 'react';

    export default function Tooltip({ children, content }) {
      const [show, setShow] = useState(false);

      return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
          {children}
          {show && (
            <div className="absolute z-10 p-md bg-surface rounded-md shadow-card text-sm text-text-secondary border border-accent">
              {content}
            </div>
          )}
        </div>
      );
    }
  