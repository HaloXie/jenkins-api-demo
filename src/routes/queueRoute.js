const express = require('express');
const assert = require('assert');

const queueManager = require('../controllers/queueController');
const { callbackHandler } = require('../utils/callback');

const router = express.Router();

// queryQueueList
router.get('/', (req, res) => {
	queueManager.queryQueueList(callbackHandler(res));
});

// 根据 queueId 终止队列
router.post('/:queueId/cancel', (req, res) => {
	const { queueId } = req.params;
	assert(queueId);

	queueManager.cancelQueueItem(
		queueId,
		callbackHandler(res, (error, result) => {
			if (!error || error === 'Server returned unexpected status code: 204') {
				return res.json({
					success: true,
				});
			}
			res.json({
				success: false,
				error: error,
			});
		})
	);
});

// 根据 queueId 查询当前状态
router.get('/:queueId', (req, res) => {
	const { queueId } = req.params;
	assert(queueId);

	queueManager.queryQueueItem(
		queueId,
		callbackHandler(res, result => {
			const { blocked, buildable, inQueueSince, cancelled } = result;

			// 注意这里，QueueID 是全局的，但是 executable 指的是当前的 Job 下的
			// 即： QueueID !== buildId
			const buildId = result.executable?.number;

			res.json({ queueId, buildId, buildable, inQueueSince, cancelled });
		})
	);
});

module.exports = router;
