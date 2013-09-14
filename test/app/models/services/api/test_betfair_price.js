/**
 * New node file
 */

 
 size = 5.743634634563
 
  if (!size)
        size = 1.01;
    if (typeof (size) === 'string')
        size = parseFloat(size);

    if (size < 1.01)
        size = 1.01;
    else if (size < 2)
        size = Math.round(size * 100.0) / 100.0;
    else if (size < 3)
        size = Math.round(size * 50.0) / 50.0;
    else if (size < 4)
        size = Math.round(size * 20.0) / 20.0;
    else if (size < 6)
        size = Math.round(size * 10.0) / 10.0;
    else if (size < 10)
        size = Math.round(size * 5.0) / 5.0;
    else if (size < 20)
        size = Math.round(size * 2.0) / 2.0;
    else if (size < 30)
        size = Math.round(size * 1.0) / 1.0;
    else if (size < 50)
        size = Math.round(size * 0.5) / 0.5;
    else if (size < 100)
        size = Math.round(size * 0.2) / 0.2;
    else if (size < 1000)
        size = Math.round(size * 0.1) / 0.1;
    else
        size = 1000.0;
 console.log(size);
 