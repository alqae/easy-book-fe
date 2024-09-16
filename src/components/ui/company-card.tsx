import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { useNavigate } from 'react-router';
import { IoLocationSharp } from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ellipsis, getInitials, getURLByAttachment } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Service, User } from '@/types/models';

export const CompanyCard: React.FC<User> = ({
  id,
  firstName,
  lastName,
  services = [],
  address,
  avatar,
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const navigate = useNavigate();

  const imageUrl = getURLByAttachment(avatar);
  const fullName = `${firstName} ${lastName}`;
  const favs = 0;

  const CATEGORIES_TO_DISPLAY_LIMIT = 5;

  const servicesToDisplay = React.useMemo<Service[]>(() => {
    if (services.length > CATEGORIES_TO_DISPLAY_LIMIT) {
      return showAll ? services : services.slice(0, CATEGORIES_TO_DISPLAY_LIMIT);
    }

    return services;
  }, [services, showAll]);

  return (
    <div className="flex flex-nowrap row gap-4 rounded-lg border p-4 text-sm transition-all hover:bg-accent bg-muted w-full">
      <Avatar className="max-w-[7.5rem] w-full h-full">
        <AvatarImage src={imageUrl} alt={fullName} />
        <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start gap-2 text-left w-full">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-xl">{fullName}</div>
            </div>
          </div>
          <div className="text-sm font-medium space-x-2">
            <FaHeart className="text-red-500 inline-block" />
            <span>{favs}</span>
          </div>
          <div className="text-sm font-medium space-x-2">
            <IoLocationSharp className="inline-block" />
            <span>{address}</span>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex-grow">
            <span className="font-medium text-md">Services</span>
            <div className="flex items-center flex-wrap gap-2 text-sm">
              {servicesToDisplay.map((service, index) => (
                <React.Fragment key={service.id}>
                  <span>{ellipsis(service.name, 35)}</span>
                  {index !== servicesToDisplay.length - 1 && <GoDotFill />}
                </React.Fragment>
              ))}
            </div>

            {services.length > CATEGORIES_TO_DISPLAY_LIMIT && (
              <Button variant="link" className="p-0" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>

          <div className="self-end">
            <Button onClick={() => navigate(`/company/${id}`)}>Book now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
