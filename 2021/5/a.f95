module hydrothermal
    implicit none

    type, public :: Segments
        integer, allocatable :: start(:, :), end(:, :)
    contains
        procedure, public :: read => read_lines
        procedure, public :: init => init_segments
        procedure, public :: max_dim => max_dim
    end type

    type, public :: Domain
        integer, allocatable :: frequency(:, :)
    contains
        procedure, public :: insert => insert_pair
        procedure, public :: init => init_domain
        procedure, public :: draw => draw_domain
        procedure, public :: score => calculate_score
    end type

    class(Segments), allocatable :: seg
    class(Domain), allocatable :: dom

contains

    function calculate_score(self)
        class(Domain), intent(in) :: self
        integer :: calculate_score
        calculate_score = count(self%frequency > 1)
        return
    end function

    subroutine draw_domain(self)
        class(Domain), intent(in) :: self
        integer :: row, digits, rows
        character(50) :: format

        rows = size(self%frequency(:, 1))
        digits = ceiling(maxval(self%frequency)**(1.0/10.0)) + 1
        ! digits =2
        write(format, "(a1,i3,a1,i1,a1)") "(", rows, "i", digits, ")"
        do row = 1, rows
            write(*, format) self%frequency(:, row)
        end do
        write(*, *)
    end subroutine

    subroutine read_lines(self, filename)
        class(Segments), intent(inout) :: self
        character(100), intent(in) :: filename
        character(100) :: line
        integer :: iostat, ii, fid
        iostat = 0
        ii = 1
        open(fid, file=filename, iostat=iostat)
        do ii = 1, size(self%start(:, 1))
            read(fid, *, iostat=iostat) self%start(ii, :), line, self%end(ii, :)
        enddo
        rewind(fid)
        close(fid)
        self%end = self%end + 1
        self%start = self%start + 1
    end subroutine

    subroutine insert_pair(self, a, b)
        class(Domain), intent(inout) :: self
        integer, allocatable :: indx(:)
        integer :: a(2), b(2), dxy(2), ii, adxy(2), c(2)
    
        dxy = b - a
        adxy = abs(dxy)
           
        if (adxy(1) > adxy(2)) then
            indx = (/(ii, ii=min(a(1), b(1)),max(a(1), b(1)), 1)/)
            self%frequency(indx, b(2)) = self%frequency(indx, b(2)) + 1
            deallocate(indx)
        else if (adxy(1) < adxy(2)) then
            indx = (/(ii, ii=min(a(2), b(2)),max(a(2), b(2)), 1)/)
            self%frequency(a(1), indx) = self%frequency(a(1), indx) + 1
            deallocate(indx)
        else
            do ii = 0, adxy(1)-1
                c = a + (dxy/adxy)*ii
                self%frequency(c(1), c(2)) = self%frequency(c(1), c(2)) + 1
            end do
        endif

    end subroutine
    
    subroutine init_domain(self, size)
        class(Domain), intent(inout) :: self
        integer, intent(in) :: size
        allocate(self%frequency(size, size))
        self%frequency=0
    end subroutine

    subroutine init_segments(self, filename)
        class(Segments), intent(inout) :: self
        character(100), intent(in) :: filename
        character(100) :: line
        integer :: iostat, size, fid
        iostat = 0
        size = 0
        open(fid, file=filename, iostat=iostat)
        do while (iostat==0)
            read(fid, "(a)", iostat=iostat) line
            if (iostat==0) then
                size = size + 1
            end if
        enddo
        rewind(fid)
        close(fid)
        allocate(self%start(size, 2), self%end(size, 2))
    end subroutine

    function max_dim(self)
        class(Segments), intent(in) :: self
        integer :: max_dim
        max_dim = max(maxval(self%start), maxval(self%end))
        return
    end function

end module

program main
    use hydrothermal, only : seg, dom
    implicit none
    character(100) :: filename
    integer :: point, max_dim

    allocate(seg)
    allocate(dom)

    call get_command_argument(1, filename)
    call seg%init(filename)
    call seg%read(filename)
    max_dim = seg%max_dim()
    call dom%init(max_dim)
    do point = 1, size(seg%start(:, 1))
        call dom%insert(seg%start(point, :), seg%end(point, :))
        ! call dom%draw()  
    end do
    ! call dom%draw()
    write(*, *) "Score:", dom%score(), size(dom%frequency), max_dim*991
    ! 21554 is not correct

end program
   