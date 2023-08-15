type PageType<T> = {
  current_page: number;
  data: Array<T>;
  last_page: number;
  per_page: number;
  total: number;
}

export default PageType;
