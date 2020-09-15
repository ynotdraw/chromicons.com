import { DialogOverlay, DialogContent } from '@reach/dialog';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const Button = ({ className, children, ...rootProps }) => (
  <button
    className={clsx(
      'w-full py-2 text-sm font-bold text-white rounded-md',
      className
    )}
    {...rootProps}
  >
    {children}
  </button>
);

export const IconModal = ({ iconInView, onDismiss }) => {
  const Icon = iconInView?.reactComponent;

  const iconContainerRef = useRef();

  const [copyState, setCopyState] = useState('default');

  useEffect(() => {
    if (copyState === 'clicked') {
      const handler = window.setTimeout(() => {
        setCopyState('default');
      }, 1500);
      return () => {
        window.clearTimeout(handler);
      };
    }
  }, [copyState]);

  return (
    <DialogOverlay
      className="transition-opacity flex flex-col justify-end sm:justify-center"
      isOpen={Boolean(iconInView)}
      onDismiss={onDismiss}
    >
      <DialogContent
        aria-label="Icon Details"
        className="bg-white text-black rounded-lg space-y-6 relative w-9/12 sm:max-w-sm"
      >
        <h3 className="text-lg leading-6 font-medium text-gray-800">
          {iconInView?.name}
        </h3>

        <div
          ref={iconContainerRef}
          className="flex justify-center items-center p-8 bg-gray-300 rounded-md"
        >
          {Boolean(Icon) && <Icon className="h-8 w-8" />}
        </div>

        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          pellentesque dui eget mauris tincidunt cursus. Aliquam erat volutpat.
          Integer fringilla ipsum at luctus pretium. Sed quis bibendum urna.
          Praesent tristique imperdiet eros, sit amet viverra turpis faucibus
          tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia curae.
        </p>

        <div className="flex flex-col space-y-3 justify-between md:space-y-0 md:flex-row sm:space-x-1">
          <Button
            className="bg-orange-400"
            onClick={() => {
              navigator.clipboard.writeText(
                `${iconContainerRef?.current?.innerHTML}`.replace(
                  / class="(.*?)"/s,
                  ''
                )
              );
              setCopyState('clicked');
            }}
          >
            {copyState === 'default' ? 'Copy as SVG' : 'Copied to Clipboard!'}
          </Button>
        </div>

        <button
          aria-label="Close modal"
          className="absolute text-white rounded-full p-2"
          onClick={onDismiss}
          style={{ top: '-3rem', right: '-3rem' }}
        >
          <svg
            className="w-8 h-8 text-white"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </DialogContent>
    </DialogOverlay>
  );
};
