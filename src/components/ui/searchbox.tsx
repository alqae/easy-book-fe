import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';

export interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  showButton?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, showButton, ...props }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form
      className="mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        if (inputRef.current && onSearch) {
          onSearch(inputRef.current.value);
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>

      <div className="relative ">
        <svg
          className={cn(
            'w-4',
            'h-4',
            'absolute',
            'top-[50%]',
            'translate-y-[-50%]',
            'left-4',
            'text-gray-500',
            'dark:text-gray-400',
          )}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>

        <input
          type="search"
          id="default-search"
          ref={inputRef}
          className={cn(
            'block',
            'w-full',
            'p-4',
            'ps-10',
            'text-sm',
            'text-gray-900',
            'border',
            'border-gray-300',
            'rounded-lg',
            'bg-gray-50',
            'focus:ring-blue-500',
            'focus:border-blue-500',
          )}
          placeholder="Search Mockups, Logos..."
          required
          {...props}
        />

        {showButton && (
          <Button
            type="submit"
            size="sm"
            className={cn('absolute', 'right-4', 'top-1/2', '-translate-y-1/2')}
          >
            Search
          </Button>
        )}
      </div>
    </form>
  );
};

SearchBox.defaultProps = {
  showButton: true,
  onSearch: () => {},
};

export { SearchBox };
