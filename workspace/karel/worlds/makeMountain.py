size = 20
mid = size / 2

for i in range(2, mid + 1):
    print 'Wall: (' + str(i) + ', ' + str(i - 1) + ') west'
    print 'Wall: (' + str(i) + ', ' + str(i) + ') south'

for i in range(1, mid):
	row = mid + i
	col = mid - i
	print 'Wall: (' + str(row) + ', ' + str(col) + ') west'
	print 'Wall: (' + str(row) + ', ' + str(col) + ') south'