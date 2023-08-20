import ReactPaginate from 'react-paginate';

type Props = {
  pageCount: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ activePage, pageCount, onPageChange }: Props) => {

  return (
    <div id='pagination-container' className='py-8 px-2 flex justify-center'>
      <ReactPaginate
        pageCount={pageCount}
        forcePage={activePage}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageLinkClassName='page-item'
        breakLinkClassName='page-item'
        nextLabel={ <i className="bi bi-chevron-right"></i> }
        previousLabel={ <i className="bi bi-chevron-left"></i> }
        activeLinkClassName='active-page'
        disabledClassName='inactive-arrow'
        onPageChange={(page) => onPageChange(page.selected)}
      />
    </div>
  )

}

export default Pagination;
