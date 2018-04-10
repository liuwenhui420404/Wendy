var gulp=require('gulp');
var web=require('gulp-webserver');
var urlTool=require('url');

gulp.task('web',function(){
    gulp.src('.')
    .pipe(web({
        host:'localhost',
        port:8087,
        middleware:function(req,res,next){
            var urlObj=urlTool.parse(req.url,true);
            var pathN=urlObj.pathname;
            console.log(pathN)
            if(pathN==='/data'){
                res.end(JSON.stringify({code:1,data:'success'}))
            }else if(pathN==='/sondata'){
                console.log(urlObj.query)//获取的url中的参数
                if(Number(urlObj.query.id)===1){
                     res.end(JSON.stringify({code:1,data:'son response success',query:urlObj.query.id,arr:['apple','pear','banana']}))
                }
             
            }
            next()
        }
    }))
})