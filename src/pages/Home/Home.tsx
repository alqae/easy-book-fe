import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { SearchBox } from '@/components/ui/searchbox';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto space-y-4 pt-20">
      <div className="">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-10">
          Easy book
        </h1>

        <SearchBox
          onSearch={(value) => navigate(`/search?${createSearchParams({ text: value })}`)}
        />
      </div>
    </div>
  );
};
