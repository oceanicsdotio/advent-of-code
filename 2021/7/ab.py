import sys

lookup = []

def crabgineering(pos, indx):
    diff = []
    for p in pos:
        dx = abs(p - indx)
        df = 0
        while dx > 0:
            df += dx
            dx -= 1 
        diff.append(df)
    return diff

def cost(pos, indx):
    diff = []
    for p in pos:
        dx = abs(p - indx)
        diff.append(dx)
    return diff

if __name__ == "__main__":

    with open(sys.argv[1], "r") as fid:
        positions = [int(x) for x in fid.readline().split(",")]

    end_range = max(positions)
    minimum = None
    min_pos = None
    for ii in range(0, end_range+1):
        if ii%(end_range/10) == 1:
            print(ii, "of", end_range)
        total = sum(crabgineering(positions, ii))
        if minimum is None or total < minimum:
            minimum = total
            min_pos = ii
    print(min_pos, minimum)
