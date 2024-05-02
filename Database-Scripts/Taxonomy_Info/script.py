ranks = {"kingdom" : 0, "phylum" : 1, "class" : 2, "order" : 3, "family" : 4, "genus" : 5, "species" : 6}

hierarchy = ["", "", "", "", "", "", ""]

with open('Taxon.txt', 'r') as file:
    lines = file.readlines()


for line in lines:
    
    if(not len(line)): continue
    arr = line.split()
    rank = ranks[arr[0]]
    hierarchy[rank] = arr[1:]
    print(*hierarchy[0], end="")
    for i in hierarchy[1:rank+1]:
        print(end=", ")
        print(*i, end="")
    print()
    
