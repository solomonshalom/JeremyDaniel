'use client';

import { ComponentProps, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { clsx } from 'clsx/lite';
import { toastSuccess } from '@/toast';
import LoaderButton from '@/components/primitives/LoaderButton';

export default function SubmitButtonWithStatus({
  icon,
  styleAs,
  spinnerColor,
  onFormStatusChange,
  onFormSubmitToastMessage,
  onFormSubmit,
  children,
  disabled,
  className,
  primary,
  type: _type,
  ...buttonProps
}: {
  onFormStatusChange?: (pending: boolean) => void
  onFormSubmitToastMessage?: string
  onFormSubmit?: () => void
  primary?: boolean
} & ComponentProps<typeof LoaderButton>) {
  const { pending } = useFormStatus();

  const pendingPrevious = useRef(pending);

  useEffect(() => {
    if (!pending && pendingPrevious.current) {
      if (onFormSubmitToastMessage) {
        toastSuccess(onFormSubmitToastMessage);
      }
      onFormSubmit?.();
    }
    pendingPrevious.current = pending;
  }, [pending, onFormSubmitToastMessage, onFormSubmit]);

  useEffect(() => {
    onFormStatusChange?.(pending);
  }, [onFormStatusChange, pending]);

  return (
    <LoaderButton
      type="submit"
      disabled={disabled}
      className={clsx(
        className,
        'inline-flex items-center gap-2',
        primary && 'primary',
      )}
      icon={icon}
      spinnerColor={spinnerColor}
      styleAs={styleAs}
      isLoading={pending}
      {...buttonProps}
    >
      {children}
    </LoaderButton>
  );
};
