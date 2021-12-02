
FILENAME = "input.txt"

if __name__ == "__main__":
    z = 0
    x = 0
    with open(FILENAME, "r") as fid:
        while True:
            try:
                line = fid.readline().split(" ")
                direction = line[0]
                distance = int(line[1])
                if direction == "forward":
                    x += distance
                elif direction == "up":
                    z -= distance
                elif direction == "down":
                    z += distance
                else:
                    break
            except:
                break
    print(z * x)