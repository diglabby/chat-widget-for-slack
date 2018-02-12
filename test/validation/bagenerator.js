function badGen() {
	    let resultTwo    = '',
		    resultThree  = '',
	        result       = '',
	        words        = '0123456789qwertyuiopasdfUIOPASDFGHJKLZXCVBNM`!?{}=*!;><^',
        	max_position = words.length - 1    	;
        
            for( i = 0; i < 6; ++i ) {
                position = Math.floor ( Math.random() * max_position );
                result = result + words.substring(position, position + 1 )  ;
            }
        
            for( i = 0; i < 4; ++i ) {
                position = Math.floor ( Math.random() * max_position );
                resultTwo = resultTwo + words.substring(position, position + 1 )  ;
            }


        // console.log(result);
        return result + '@' + resultTwo + '.com'
};

module.exports = badGen;