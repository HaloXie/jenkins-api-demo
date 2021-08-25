/**
 *
 */
const jenkinsInstance = require('../instances/jenkins');

/**
 * 查询所有的 queue
 */
const queryQueueList = cb => jenkinsInstance.queue(cb);

/**
 * 返回 queueId，通过 queueId 可以在 queryQueueItem 中查询到 buildId
 * @param {*} jobName
 * @param {*} cb
 * @returns { queueId:string }
 */
const buildJob = (jobName, cb) => jenkinsInstance.build(jobName, cb);

/**
 * 根据 queueId 查询 buildId
 * @param {*} queueId
 * @param {*} cb
 * @returns {executable: {number: string}}
 */
const queryQueueItem = (queueId, cb) => jenkinsInstance.build(queueId, cb);

/**
 * 根据 queueId 取消队列中的任务
 * @param {*} queueId
 * @param {*} cb
 * @returns
 */
const cancelQueueItem = (queueId, cb) => jenkinsInstance.cancel_item(queueId, cb);

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

module.exports = {
	queryQueueList,
	buildJob,
	queryQueueItem,
	cancelQueueItem,
	queryBuildInfo,
	stopBuildJob,
	queryJobConsole,
};
