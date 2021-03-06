"""
Count numbers in an array which are greater than the immediately proceeding
entry (if any).
"""
FILENAME = "input.txt"

if __name__ == "__main__":
    previous = None
    increase = 0 
    
    with open(FILENAME, "r") as fid:
        while True:
            text = fid.readline().strip()
            try:
                # empty string at last position
                line = int(text)
            except ValueError:
                break
            try:
                if line > previous:
                    increase += 1
            except TypeError:
                pass
            previous = line
            
    print("Total count", increase)
    