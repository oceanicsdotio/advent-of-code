
FILENAME = "input.txt"
TEST_CASE = "test.txt"

if __name__ == "__main__":
    z = 0
    x = 0
    aim = 0
    with open(FILENAME, "r") as fid:
        while True:
            try:
                line = fid.readline().split(" ")
                direction = line[0]
                distance = int(line[1])
                if direction == "forward":
                    x += distance
                    z += aim*distance
                elif direction == "up":
                    aim -= distance
                elif direction == "down":
                    aim += distance
                else:
                    break
            except:
                break
    print(z * x)