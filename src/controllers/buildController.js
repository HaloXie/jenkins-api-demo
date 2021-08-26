/**
 *
 */
const jenkinsInstance = require('../instances/jenkins');

/**
 * 返回该 Job 下所有的 Build 信息
 */
const queryAllBuilds = (jobName, cb) => jenkinsInstance.all_builds(jobName, cb);

/**
 * 查询上一次 build 信息
 */
const queryLastBuildInfo = (jobName, cb) => jenkinsInstance.last_build_info(jobName, cb);

/**
 * 返回 queueId，通过 queueId 可以在 queryQueueItem 中查询到 buildId
 * @param {*} jobName
 * @param {*} cb
 * @returns { queueId:string }
 */
const buildJob = (jobName, cb) => jenkinsInstance.build(jobName, cb);

/**
 * 查询当前的 build 记录
 */
const queryBuildInfo = (jobName, buildId, cb) => jenkinsInstance.build_info(jobName, buildId, cb);

/**
 *
 * @param {*} jobName
 * @param {*} buildId buildJob 会产生一个 queueId，通过 queue_item 查询到 executable.number 就是 buildId
 * @param {*} cb
 * @returns
 */
const stopBuildJob = (jobName, buildId, cb) => jenkinsInstance.stop_build(jobName, buildId, cb);

/**
 * 返回输出日志
 * todo: 不知道是否是实时的
 * @param {*} jobName
 * @param {*} buildId
 * @param {*} cb
 * @returns
 */
const queryJobConsole = (jobName, buildId, cb) =>
	jenkinsInstance.console_output(jobName, buildId, cb);

/**
 * 删除 build 任务，
 */
const deleteBuildJob = (jobName, buildId, cb) => jenkinsInstance.delete_build(jobName, buildId, cb);

module.exports = {
	buildJob,

	queryBuildInfo,
	stopBuildJob,
	queryJobConsole,
	deleteBuildJob,
	queryAllBuilds,
	queryLastBuildInfo,
};
