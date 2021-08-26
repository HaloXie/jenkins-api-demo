/**
 *
 */
const jenkinsInstance = require('../instances/jenkins');

/**
 * 查询所有的 queue
 */
const queryQueueList = cb => jenkinsInstance.queue(cb);

/**
 * 根据 queueId 取消队列中的任务
 * @param {*} queueId
 * @param {*} cb
 * @returns
 */
const cancelQueueItem = (queueId, cb) => jenkinsInstance.cancel_item(queueId, cb);

/**
 * 根据 queueId 查询 buildId
 * @param {*} queueId
 * @param {*} cb
 * @returns {executable: {number: string}}
 */
const queryQueueItem = (queueId, cb) => jenkinsInstance.queue_item(queueId, cb);

module.exports = {
	queryQueueList,
	queryQueueItem,
	cancelQueueItem,
};
