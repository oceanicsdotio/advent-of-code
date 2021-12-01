from collections import deque

FILENAME = "input.txt"
LOOK_BACK = 3

def filter_empty(item: str) -> bool:
    return len(item) == 0

if __name__ == "__main__":
  
    previous = None
    increase = 0
    window = deque()
    
    with open(FILENAME, "r") as fid:
        while True:
            text = fid.readline().strip()
            try:
                # empty string at last position
                line = int(text)
            except ValueError:
                break
            window.append(line)
            if len(window) > LOOK_BACK:
                previous = window.popleft()
            try:
                if line > previous:
                    increase += 1
            except TypeError:
                pass
            
    print("Total count", increase)