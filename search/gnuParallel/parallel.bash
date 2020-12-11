#!/bin/bash

# distribute work to multiple hosts
# parallel --sshlogin $(cat servers) < jobs

parallel < jobs



# Previous wrong approach...

# TARGET=$1
# ALPHABET=$2
# RESULT_FILE="spaced_combos"

# TARGET_LEN=${#TARGET}

# indexing=""
# for ((n=1; n < ($TARGET_LEN + 1); n++));
# do
#     indexing="${indexing}{$n}"
# done


# param_list=""
# for ((m=0; m < ($TARGET_LEN); m++));
# do
#     param_list="${param_list} ::: $(echo $ALPHABET | sed 's/.\{1\}/& /g')"
# done

# parallel "echo $indexing" $param_list > $RESULT_FILE

# found="$(parallel grep $TARGET ::: $RESULT_FILE | head -n 1)"
# if [ -z "$found" ]; then
#     echo "not found"
# else
#     echo "found"
# fi

# rm -f $RESULT_FILE