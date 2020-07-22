import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { forwardRef } from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from '@material-ui/lab';
import { useRouter } from 'next/router';

import { getAsString } from '../getAsString';

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();

  return (
    <Pagination
      color="primary"
      page={parseInt(getAsString(query.page) || '1')}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export const MaterialUiLink = forwardRef<
  HTMLAnchorElement,
  MaterialUiLinkProps
>(({ query, item, ...props }, ref) => (
  <Link
    href={{
      pathname: '/cars',
      query: { ...query, page: item.page },
    }}
    shallow
  >
    <a ref={ref} {...props}></a>
  </Link>
));
