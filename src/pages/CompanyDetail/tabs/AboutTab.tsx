import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineMail, MdPhone } from 'react-icons/md';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export interface AboutTabProps {
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export const AboutTab: React.FC<AboutTabProps> = ({ description, address, phoneNumber, email }) => (
  <div className="grid grid-cols-12 gap-6">
    <div className="space-y-4 col-span-8">
      <div className="border shadow-md p-4 rounded-md">
        <p>{description}</p>
      </div>

      {/* TODO: add reviews section */}
    </div>

    <div className="col-span-4 border shadow-md p-4 rounded-md">
      <Button className="w-full" onClick={() => window.open(`mailto:${email}`)}>
        Contact Us
      </Button>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div>
          <div className="space-x-2">
            <FaMapMarkerAlt className="inline" />
            <strong className="align-middle">Address </strong>
          </div>

          <p>{address}</p>
        </div>

        <div>
          <div className="space-x-2">
            <MdOutlineMail className="inline" />
            <strong className="align-middle">Email: </strong>
          </div>

          <p>{email}</p>
        </div>

        <div>
          <div className="space-x-2">
            <MdPhone className="inline" />
            <strong className="align-middle">Phone: </strong>
          </div>

          <p>{phoneNumber}</p>
        </div>
      </div>
    </div>
  </div>
);
