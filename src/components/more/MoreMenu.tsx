import { ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreMenuItem from './MoreMenuItem';

export interface MoreMenuItem {
  label: ReactNode
  icon?: ReactNode
  href?: string
  hrefDownloadName?: string
  action?: () => Promise<void> | void
}

export default function MoreMenu({
  items,
  className,
  buttonClassName,
  ariaLabel,
}: {
  items: MoreMenuItem[]
  className?: string
  buttonClassName?: string
  ariaLabel: string
}){
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            buttonClassName,
            'p-1 min-h-0 border-none shadow-none hover:outline-none',
            'hover:bg-gray-100 active:bg-gray-100',
            'hover:dark:bg-gray-800/75 active:dark:bg-gray-900',
            'text-dim',
          )}
          aria-label={ariaLabel}
        >
          <FiMoreHorizontal size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className={clsx(
            className,
            'min-w-[8rem]',
            'ml-2.5',
            'p-1 rounded-md border',
            'bg-content',
            'shadow-lg dark:shadow-xl',
          )}
        >
          {items.map(({ label, icon, href, hrefDownloadName, action }) =>
            <MoreMenuItem
              key={`${label}`}
              label={label}
              icon={icon}
              href={href}
              hrefDownloadName={hrefDownloadName}
              action={action}
            />
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
