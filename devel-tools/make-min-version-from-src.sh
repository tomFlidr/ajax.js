# Minimize source code from file "../builds/latest/ajax.src.js" 
# with Google Closure Compiller (https://github.com/google/closure-compiler) in advanced mode
# and overwrite file "../builds/latest/ajax.min.js"

# initialization
compiller=closure-compiler-v20200719.jar
sourceFile=../builds/latest/ajax.src.js
resultFile=../builds/latest/ajax.min.js

if [ -f "$resultFile" ]; then
	rm $resultFile
fi

java -jar bin/$compiller --compilation_level ADVANCED_OPTIMIZATIONS --env BROWSER --js $sourceFile --warning_level QUIET --js_output_file $resultFile

# echo done and pause to see result
echo DONE
read -n1 -r -p "Press any key to continue..." key