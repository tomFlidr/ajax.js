:: Minimize source code from file "../builds/latest/ajax.src.js" 
:: with Google Closure Compiller (https://github.com/google/closure-compiler) in advanced mode
:: and overwrite file "../builds/latest/ajax.min.js"

:: initialization
@setlocal EnableDelayedExpansion
@set compiller=closure-compiler-v20200719.jar
@set sourceFile=..\builds\latest\ajax.src.js
@set resultFile=..\builds\latest\ajax.min.js

@if exist %resultFile% del %resultFile%

@java -jar bin/%compiller% --compilation_level ADVANCED_OPTIMIZATIONS --env BROWSER --js %sourceFile% --warning_level QUIET --js_output_file %resultFile%

:: echo done and pause to see result
@echo DONE
@pause