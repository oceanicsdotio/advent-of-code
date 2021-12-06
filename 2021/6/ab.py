from functools import reduce
from collections import deque
from itertools import repeat
import sys

CYCLE = 7
DELAY = 2
BINS = CYCLE + DELAY
school = deque(repeat(0, BINS))

def reducer(acc, cur):
    acc[cur] = acc[cur] + 1
    return acc

def epoch(school: deque):
    school.rotate(-1)
    school[CYCLE-1] += school[BINS-1]
    
def evolve(school, epochs):
    for _ in range(0, epochs):
        epoch(school)
    return school

if __name__ == "__main__":
    with open(sys.argv[1], "r") as fid:
        fish = map(lambda x: int(x), fid.readline().split(","))
    print(sum(evolve(reduce(reducer, fish, school), int(sys.argv[2]))))
   