# TARGET_STRING
ALPHABET="hello"
TARGET="hello"
len=${#ALPHABET}

param_list=""
for ((n=0; n < ($len); n++));
do
    param_list="${param_list} ::: $(echo $ALPHABET | sed 's/.\{1\}/& /g')"
done

parallel "echo {}" $param_list > spaced_combos


indexing=""
for ((m=1; m < ($len + 1); m++));
do
    indexing="${indexing}{$m}"
done

# gcc -o search ./search.c
# parallel --colsep ' ' "./search $indexing $TARGET" :::: spaced_combos > results

parallel --colsep ' ' "echo $indexing" :::: spaced_combos > unspaced_combos
found=$(cat unspaced_combos | grep "$TARGET")
if [ -z "$found" ]; then
    echo "not found"
else
    echo "found"
fi

rm -f ./*spaced_combos