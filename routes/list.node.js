/**
 * Dancer list page
 *
 * Author: 	justin.maj
 * Date: 	2012-2-12   
 */

var db 			= require("../database/database.js").db;
var cCourse 	= require("../database/course.js").currentCourse;
var courseList 	= require("../database/course.js").courseList;


/*
 * 会员信息列表接口. 默认情况应当以当前开设课程为查询条件
 */
exports.list = function(req, res){
	// 默认查当前开设的两门课程中，所有课程报名审核通过，且已经缴费的会员.需要提示用户当前搜索条件
	// var condition = {courses:{	$elemMatch:
	// 							{'courseVal':{$in: [cCourse.courseA.cValue, cCourse.courseB.cValue]},
	// 							 'status':'approved', 'paid':true
	// 							}
	// 						 }
	// 				};
	// db.collection('latin').find(condition).toArray(function(err, result) {});

	res.render('list', {
        title: 		'课程报名信息',
        courseList: courseList,
        cCourse: 	cCourse	    
    });
	
};

/*
 * 会员列表筛选/搜索接口. TODO: 需要提示用户当前搜索条件
 */
exports.search = function(req, res){

	var dancerModel = {};
	// 根据课程状态，是否缴费来进行查询
	if (!!req.body.dancerID) 	{dancerModel.dancerID = req.body.dancerID;};
	if (!!req.body.gender) 		{dancerModel.gender = req.body.gender;};
	if (!!req.body.department) 	{dancerModel.department = req.body.department;};

	// 内嵌文档精确匹配
	dancerModel.courses = {};
	dancerModel.courses.$elemMatch = {};
	if (!!req.body.course) {
		dancerModel.courses.$elemMatch.courseVal = req.body.course;
	};
	if (!!req.body.status) {
		dancerModel.courses.$elemMatch.status = req.body.status;
	};
	if (!!req.body.paid) {
		// req.body.paid取得的是“true”、“false”字符串，需要转换
		dancerModel.courses.$elemMatch.paid = JSON.parse(req.body.paid);
	};

	// console.log('User Current Search Condition:', dancerModel);

	db.latin.findDancerByCondition(dancerModel, function(err, result) {

	    if (err) throw err;

		res.contentType('application/json');
		res.send({data:result});

	});

};
