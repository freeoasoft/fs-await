let fs = require('fs');

let slice = Array.prototype.slice;


(function () {

    let names = 'access,exists,readFile,close,read,write,rename,truncate,ftruncate,rmdir,fdatasync,fsync,mkdir,readdir,fstat,lstat,stat,readlink,link,unlink,fchmod,chmod,fchown,chown,utimes,futimes,writeFile,appendFile,realpath,mkdtemp,copyFile'.split(',');

    for (var i = 0, l = names.length; i < l; i++)
    {
        let name = names[i];
        exports[name] = compile_fn(fs[name]);
    }

})();


function compile_fn(fn) {

    return function () {
        
        var args = slice.call(arguments, 0);

        return new Promise((resolve, reject) => {
            
            args.push((err, data) => {
                
                if (err)
                {
                    return reject(err);
                }

                resolve(data);
            });

            fn.apply(fs, args);
        });
    };
};


//此方法不能在运行时动态调用,否则会出现过期警告
// function find_async() {
    
//     let keys = Object.getOwnPropertyNames(fs);
//     let list = [];

//     for (var i = 0, l = keys.length; i < l; i++)
//     {
//         let key = keys[i];
//         let fn = fs[key];

//         if (typeof fn === 'function' && !/Sync$/.test(fn.name))
//         {
//             let any = '' + fn;

//             any = any.substring(any.indexOf('(') + 1, any.indexOf(')'));
//             any = any.match(/[^\s,]+/g);

//             if (any && any.pop() === 'callback')
//             {
//                 list.push(key);
//             }
//         }
//     }
// };