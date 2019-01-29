#!/usr/bin/expect

proc myfunc { TOTAL } {
    set TOTAL [ expr $TOTAL + 2 ]
    return "$TOTAL"
}

set NUM 0
while { $NUM <= 5 } {
    puts "Number $NUM"
    set NUM [myfunc $NUM]
}
