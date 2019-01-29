#!/usr/bin/expect -f
set NUM 0 
while { $NUM <= 5 } {
    puts "Number is $NUM"
    set NUM [ expr $NUM + 1 ]
}

