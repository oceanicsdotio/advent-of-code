program main
    implicit none
    character(:), allocatable :: filename
    character(100) :: line
    integer :: ii=0, fid, iostat
    integer(2) :: start, end
    filename="test.txt"
    open(fid, file=filename, iostat=iostat)
    do while (iostat==0)
        read(fid, '(i2)', iostat=iostat) start
        read(fid, '(a4)', iostat=iostat)
        read(fid, '(i2)', iostat=iostat) end
        if (iostat==0) then
            write(*, *) start, end
            ii = ii + 1
        end if
    enddo
end program
   