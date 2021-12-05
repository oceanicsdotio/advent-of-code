program main
    implicit none
    character(100) :: line, filename
    integer :: ii=0, fid, iostat, max_dim
    integer, allocatable :: start(:, :), end(:, :), mask(:, :)

    call get_command_argument(1, filename)
    open(fid, file=filename, iostat=iostat)

    do while (iostat==0)
        read(fid, *, iostat=iostat) line
        if (iostat==0) then
            ii = ii + 1
        end if
    enddo

    iostat = 0
    rewind(fid)
    allocate(start(ii, 2), end(ii, 2))
    ii = 0

    do while (iostat==0)
        ii = ii + 1
        read(fid, *, iostat=iostat) start(ii, :), line, end(ii, :)
    enddo

    max_dim = max(maxval(start), maxval(end))
    allocate(mask(max_dim, max_dim))
    mask = 0
    do ii = 1, size(start(:, 1)) 
        if (any(start(ii, :) .eq. end(ii, :))) then 
            write(*, *) start(ii, :), end(ii, :)
            mask(start(ii,2):end(ii,2)+1, start(ii,1):end(ii,1)+1) = mask(start(ii,2):end(ii,2)+1, start(ii,1):end(ii,1)+1) + 1
        end if
    enddo
    write(*, *) count(mask > 1)
    
end program
   