module bingo
    implicit none

    type, public :: Board
        integer, allocatable, public :: matrix(:, :)
        logical, allocatable, public :: mask(:, :)
        integer :: size = 5, turn = 0, score = 0
    contains
        procedure, public :: read => read_board 
        procedure, public :: event => insert_event
        procedure, public :: play => run_event_stream
    end type

    type, public :: EventStream
        integer, allocatable, public :: stream(:)
    contains
        procedure, public :: read => read_event_stream
    endtype

contains

    subroutine read_event_stream(self, fid)
        class(EventStream), intent(inout) :: self
        integer, intent(in) :: fid
        integer, parameter :: buffer_width=10, max_doc_length = 10000000
        character(buffer_width) :: buffer
        integer :: iostat=0, ind = 0, start, end, event_count
        character(max_doc_length), allocatable :: text
        allocate(text)
        
        do while(iostat == 0)
            read(fid, "(a)", iostat=iostat, advance="no") buffer
            if (iostat == 0) then
                start = ind * buffer_width + 1
                end = start + buffer_width
                text(start : end) = trim(buffer)
                ind = ind + 1
            endif
        enddo

        event_count = count(transfer(text, 'a', len(trim(text))) == ",") + 1
        allocate(self%stream(event_count))
        read(text, *) self%stream
    end subroutine

    subroutine read_board(self, fid)
        class(Board), intent(inout) :: self
        integer, intent(in) :: fid
        integer :: ii
        if (.not. allocated(self%matrix)) then
            allocate(self%matrix(self%size, self%size))
        endif
        do ii = 1, self%size
            read(fid, *) self%matrix(ii, :)
        enddo
    end subroutine

    subroutine insert_event(self, event)
        class(Board), intent(inout) :: self
        integer, intent(in) :: event
        if (.not. allocated(self%mask)) then
            allocate(self%mask(self%size, self%size))
            self%mask(:, :) = .false.
        endif
        self%mask(:, :) = self%mask .or. (self%matrix(:, :) .eq. event)
    end subroutine

    subroutine run_event_stream(self, stream, fid)
        class(Board), intent(inout) :: self
        class(EventStream), intent(in) :: stream
        integer, intent(in) :: fid
        integer :: ii, event
        integer :: inverse(self%size, self%size)

        call self%read(fid)
        do ii = 1, size(stream%stream)
            event = stream%stream(ii)
            call self%event(event)
            self%turn = self%turn + 1
            if (any(all(self%mask, 1)) .or. any(all(self%mask, 2))) then
                inverse = 0
                where (.not. self%mask)
                    inverse = self%matrix
                end where
                self%score = sum(inverse) * event
                exit
            end if
        end do
    end subroutine

end module bingo

program main

    use bingo, only : Board, EventStream
    implicit none

    integer :: fid, iostat, ii=0
    class(Board), allocatable :: boards(:)
    class(EventStream), allocatable :: events

    allocate(events)
    allocate(boards(1000))

    open(fid, file="./input.txt", status="old", iostat=iostat) 
    ! read number draws
    call events%read(fid)
    do while (iostat == 0)
        read(fid, *, iostat=iostat)
        if (iostat .ne.  0) exit
        ii = ii + 1
        call boards(ii)%play(events, fid)
    end do 

    write(*, *) boards(minloc(boards%turn, boards%turn .gt. 0))%score
    write(*, *) boards(maxloc(boards%turn, boards%turn .gt. 0))%score
    
end program main