import React from 'react';
import { useParams } from 'react-router';
import { MdOutlineFavorite } from 'react-icons/md';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetCompanyDetailQuery } from '@/lib/api';
import { getURLByAttachment } from '@/lib/utils';
import { ServicesTab } from './tabs/ServicesTab';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/requests';
import { AboutTab } from './tabs/AboutTab';
import { Service } from '@/types/models';

export const CompanyDetailPage: React.FC = () => {
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);

  const { id = '0' } = useParams();
  const {
    data: company,
    isLoading,
    isError,
    error,
  } = useGetCompanyDetailQuery(parseInt(id, 10), {
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

  if (!company) return null;

  const {
    avatar,
    email,
    firstName,
    lastName,
    address,
    description,
    phoneNumber,
    services = [],
  } = company.data;

  return (
    <div className="space-y-6">
      <div className="border-b py-10">
        <div className="container flex flex-row flex-nowrap gap-8 items-center">
          <Avatar className="max-w-[7.5rem] w-full h-full shadow-lg">
            <AvatarImage src={getURLByAttachment(avatar)} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              <span className="sr-only">{`${firstName} ${lastName}`}</span>
            </AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold">{`${firstName} ${lastName}`}</h1>

          <Button variant="following-ring">
            <MdOutlineFavorite />
            <span>Fave it</span>
          </Button>
        </div>
      </div>

      <div className="container !mb-10">
        <Tabs defaultValue="about" className="w-full space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="about" className="w-full">
              About
            </TabsTrigger>

            <TabsTrigger value="services" className="w-full">
              Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutTab
              description={description}
              phoneNumber={phoneNumber}
              address={address}
              email={email}
            />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab
              services={services}
              value={selectedServices}
              onChange={setSelectedServices}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
