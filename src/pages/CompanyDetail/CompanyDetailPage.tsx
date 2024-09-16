import React from 'react';
import { useParams } from 'react-router';
import { LuAlarmClock } from 'react-icons/lu';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { MdOutlineFavorite, MdOutlineMail } from 'react-icons/md';

import { FaMoneyBillWave, FaTrash } from 'react-icons/fa6';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useGetCompanyDetailQuery } from '@/lib/api';
import { cn, getURLByAttachment } from '@/lib/utils';
import { ApiResponse } from '@/types/requests';
import { Button } from '@/components/ui/button';
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

  if (!company) {
    return <div>No data</div>;
  }

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

  const handleSelectService = (service: Service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

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
            <div className="grid grid-cols-12 gap-6">
              <div className="space-y-4 col-span-8">
                <div className="border shadow-md p-4 rounded-md">
                  <p>{description}</p>
                </div>

                {/* TODO: add reviews section */}
                {/* <div className="border shadow-md p-4 rounded-md">
                  <h1>{`${firstName} ${lastName}`}</h1>
                </div> */}
              </div>

              <div className="col-span-4 border shadow-md p-4 rounded-md">
                <Button className="w-full">Book now</Button>
                <Separator className="my-4" />

                <div className="grid grid-cols-12">
                  <div className="col-span-3 space-x-2">
                    <FaMapMarkerAlt className="inline" />
                    <strong className="align-middle">Address: </strong>
                  </div>

                  <div className="col-span-9">{address}</div>

                  <div className="col-span-3 space-x-2">
                    <MdOutlineMail className="inline" />
                    <strong className="align-middle">Email: </strong>
                  </div>

                  <div className="col-span-9">{email}</div>

                  <div className="col-span-3 space-x-2">
                    <FaPhoneAlt className="inline" />
                    <strong className="align-middle">Phone: </strong>
                  </div>

                  <div className="col-span-9">{phoneNumber}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 border shadow-md rounded-md">
                {services.map((service, index) => (
                  <React.Fragment key={service.id}>
                    <button
                      className={cn(
                        'p-4',
                        'w-full',
                        'text-left',
                        'hover:bg-muted',
                        'hover:cursor-pointer',
                        selectedServices.find((s) => s.id === service.id) && 'bg-muted',
                      )}
                      onClick={() => handleSelectService(service)}
                    >
                      <span className="font-bold text-lg">{service.name}</span>
                      <br />
                      <span className="text-sm text-muted-foreground">{service.description}</span>
                      <div className="space-x-2 text-sm text-muted-foreground">
                        <FaMoneyBillWave className="inline" />
                        <span>${service.price}</span>
                      </div>
                      <div className="space-x-2 text-sm text-muted-foreground">
                        <LuAlarmClock className="inline" />
                        <span>{service.duration}</span>
                      </div>
                    </button>
                    {index !== services.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>

              <div className="col-span-4">
                <div className="border shadow-md p-4 rounded-md ">
                  <h4 className="text-xl font-bold">Your Visit</h4>
                  <Separator className="my-4" />
                  {selectedServices.map((service) => (
                    <React.Fragment key={service.id}>
                      <div className="flex flex-row justify-between items-center gap-2">
                        <span className="font-bold text-sm flex-1">{service.name}</span>
                        <span className="text-sm text-muted-foreground">${service.price}</span>
                        <Button
                          size="icon"
                          variant="link"
                          className="p-0 text-destructive"
                          onClick={() => handleSelectService(service)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
                  {/* <Separator className="my-4" /> */}
                  <span className="text-sm text-foreground block mb-2 text-center">
                    Add another from the list, or
                  </span>
                  <Button className="w-full" disabled={!selectedServices.length}>
                    Choose Date and Time
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
