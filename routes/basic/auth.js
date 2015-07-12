var auth = {};
auth.isLoggedIn = function(req, res, next) {
	console.log("isLoggedIn");
    if (req.isAuthenticated())
	{
		console.log("suc");
        return next();
	}

    res.redirect('/login');
};

auth.isTeacher = function(req, res, next) {
	if (req.session.user.status == "教师") 
		return next();
	
	res.redirect('/login');
};

auth.isStudent = function(req, res, next) {
	if (req.session.user.status == "学生") 
		return next();
	
	res.redirect('/login');
};

auth.isAdmin = function(req, res, next) {
	if (req.session.user.status == "系统管理员") 
		return next();
	
	res.redirect('/login');
};

auth.isAdmin2 = function(req, res, next) {
	if (req.session.user.status == "系统管理员") 
		return next();
	
	res.redirect('/info/personinfo');
};

module.exports = auth; 
