import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MdOutlineFavorite } from 'react-icons/md';
import { useParams } from 'react-router';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getInitials, getURLByAttachment } from '@/lib/utils';
import { AboutTab } from '../CompanyDetail/tabs/AboutTab';
import { useGetCustomerDetailQuery } from '@/lib/api';
import { ApiResponse } from '@/types/requests';
import { Button } from '@/components/ui/button';

export const CustomerDetailPage: React.FC = () => {
  const { id = '0' } = useParams();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetCustomerDetailQuery(parseInt(id, 10), {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="container mt-6">
        <Alert variant="destructive">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {((error as FetchBaseQueryError).data as ApiResponse)?.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!response) return null;

  const { avatar, email, firstName, lastName, address, description, phoneNumber } = response.data;

  return (
    <div className="space-y-6">
      <div className="border-b py-10">
        <div className="container flex flex-row flex-nowrap gap-8 items-center">
          <Avatar className="max-w-[7.5rem] w-full h-full shadow-lg">
            <AvatarImage src={getURLByAttachment(avatar)} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold">{`${firstName} ${lastName}`}</h1>

          <Button variant="following-ring">
            <MdOutlineFavorite />
            <span>Fave it</span>
          </Button>
        </div>
      </div>

      <div className="container !mb-10">
        <AboutTab
          description={description}
          phoneNumber={phoneNumber}
          address={address}
          email={email}
        />
      </div>
    </div>
  );
};
