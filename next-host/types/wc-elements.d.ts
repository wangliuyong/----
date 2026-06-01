import type React from 'react';

type WcProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  theme?: string;
  'api-base'?: string;
  mode?: string;
  'article-id'?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wc-home': WcProps;
      'wc-about': WcProps;
      'wc-blog': WcProps;
      'wc-projects': WcProps;
      'wc-contact': WcProps;
      'wc-links': WcProps;
    }
  }
}

export {};
