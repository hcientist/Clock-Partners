# Thanks to Jim!
# For r=0:n-2
# 	Pair r and n-1
#	
# 	For i=1:n/2-1
# 		Pair r+i (mod n-1) and r-i (mod n-1)
# 	end
# end
import sys
n = int(sys.argv[1])
names = range(n)
rounds = range(n-1)
pairs = {}
for name in names:
  pairs[name]=[]

for r in range(n-1): #exclusive, last r is n-2
  pairs[names[r]].append(names[n-1])
  pairs[names[n-1]].append(names[r])
  for i in range(1, n/2):
    pairs[names[(r+i)%(n-1)]].append(names[(r-i)%(n-1)])
    pairs[names[(r-i)%(n-1)]].append(names[(r+i)%(n-1)])
for p in pairs.keys():
  print p, ":", pairs[p]