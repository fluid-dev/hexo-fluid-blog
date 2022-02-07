hexo.extend.filter.register('theme_inject', function(injects) {
	injects.bodyEnd.raw('adsense', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2938778520580915" crossorigin="anonymous"></script>');
});
