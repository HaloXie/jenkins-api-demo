/**
 *
 */
const jenkinsInstance = require('../instances/jenkins');

const xmlConfig = {
	createJob: description =>
		`<?xml version="1.0" encoding="UTF-8"?><project><description>${description}</description></project>`,
};

const checkJobName = jonName => {
	const resp = '<div/>';

	// if existed
	// <div class=error><img src='/static/425fa7cd/images/none.gif' height=16 width=1>A job already exists with the name ‘test1’</div>
	if (resp === '<div/>') {
		return true;
	}
	return false;
};

// 因为使用了 self 等，如果直接 promisify 出现错误，采用最原始的吧
const createJob = (jobName, description, cb) =>
	jenkinsInstance.create_job(jobName, xmlConfig.createJob(description), cb);

const queryJobs = cb => jenkinsInstance.all_jobs(cb);
const queryJob = (jobName, cb) => jenkinsInstance.job_info(jobName, cb);
const deleteJob = (jobName, cb) => jenkinsInstance.delete_job(jobName, cb);
const enableJob = (jobName, cb) => jenkinsInstance.enable_job(jobName, cb);
const disableJob = (jobName, cb) => jenkinsInstance.disable_job(jobName, cb);

const queryJobConfig = (jobName, cb) => jenkinsInstance.get_config_xml(jobName, cb);
const updateJobConfig = (jobName, configFn, cb) =>
	jenkinsInstance.update_config(jobName, configFn, cb);

module.exports = {
	createJob,
	queryJobs,
	queryJob,
	updateJobConfig,
	queryJobConfig,
	deleteJob,
	enableJob,
	disableJob,
};
