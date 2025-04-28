
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  language = 'javascript',
  children,
  className
}) => {
  return (
    <div className="relative group mt-4 mb-6 bg-vulnscribe-dark/10 rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-vulnscribe-dark/80 text-white rounded opacity-70">
        {language}
      </div>
      <pre
        className={cn(
          "code-block whitespace-pre-wrap text-sm p-4 font-mono text-vulnscribe-dark border border-vulnscribe-dark/20",
          className
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
