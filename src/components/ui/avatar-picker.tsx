import { FaRegFileImage } from 'react-icons/fa6';
import { FaPaperclip } from 'react-icons/fa';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { getURLByAttachment } from '@/lib/utils';
import { AttachmentGroup } from '@/types/enums';
import { ApiResponse } from '@/types/requests';
import { Attachment } from '@/types/models';
import { Button } from './button';
import { toast } from './use-toast';

export interface AvatarPickerProps {
  onChange: (value: Attachment) => void;
  // eslint-disable-next-line react/require-default-props
  value?: Attachment;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ value, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/shared/upload-file/${AttachmentGroup.AVATARS}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );

    if (response.ok) {
      const responseJson: ApiResponse<Attachment> = await response.json();
      toast({ variant: 'success', title: responseJson.message });
      onChange(responseJson.data);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={inputRef}
        multiple={false}
        hidden
        onChange={(e) => {
          const { files } = e.target;

          if (files && files.length > 0) {
            upload(files.item(0) as File);
          }
        }}
      />

      <Avatar className="w-full h-auto aspect-square" onClick={() => inputRef.current?.click()}>
        <AvatarImage
          className="aspect-square"
          src={value ? getURLByAttachment(value) : ''}
          alt="@shadcn"
        />
        <AvatarFallback className="text-3xl">
          <FaRegFileImage />
        </AvatarFallback>
      </Avatar>

      <Button
        type="button"
        size="icon"
        className="absolute bottom-[10%] right-[10%]"
        onClick={() => inputRef.current?.click()}
      >
        <FaPaperclip />
      </Button>
    </div>
  );
};
