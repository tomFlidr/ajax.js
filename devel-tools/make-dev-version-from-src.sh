# Replace all occurrences of object['propertyToNotMinimized'] from source file "../builds/latest/ajax.src.js" 
# into standard script form: object.propertyToNotMinimized and overwrite file "../builds/latest/ajax.dev.js"
# Thanks for JScript regexp in command line from: http://www.dostips.com/forum/viewtopic.php?t=6044

# initialization
sourceFile=../builds/latest/ajax.src.js
resultFile=../builds/latest/ajax.dev.js

if [ -f "$resultFile" ]; then
	rm $resultFile
fi
cp $sourceFile $resultFile

# replace all syntax like object['propertyToNotMinimized'] to syntax like object.propertyToNotMinimized
search(){
    search_result="`grep -E -e "\['([^']*)'\]" $resultFile`"
	search_length=${#search_result}
    echo "$search_length"
}
search_length=1
while [ $search_length -gt 0 ]
do
	sed -i -E -s "s/\['([^']*)'\]/.\1/" $resultFile
	search_length=$(search)
done

# echo done and pause to see result
echo DONE
read -n1 -r -p "Press any key to continue..." key
