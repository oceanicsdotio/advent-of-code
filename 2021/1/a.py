"""
Count numbers in an array which are greater than the immediately proceeding
entry (if any).
"""
FILENAME = "input-a.txt"

if __name__ == "__main__":
    previous = None
    increase = 0  
    decrease = 0
    equal = 0
    total = 0  # keep track of all values
    
    with open(FILENAME, "r") as fid:
        while True:
            text = fid.readline().strip()
            try:
                # empty string at last position
                line = int(text)
            except ValueError:
                break
            total += 1
            try:
                if line > previous:
                    increase += 1
                elif line < previous:
                    decrease += 1
                else:
                    equal += 1
            except TypeError:
                pass
            previous = line

    # assert(total and (total == (increase + decrease + equal + 1)), "Something's not right")
    print("Total count", increase)
    