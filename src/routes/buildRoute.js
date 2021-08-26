const express = require('express');
const assert = require('assert');

const buildManager = require('../controllers/buildController');
const { callbackHandler } = require('../utils/callback');

const router = express.Router();

// queryAllBuilds
router.get('/:jobName', (req, res) => {
	const { jobName } = req.params;
	assert(jobName);

	buildManager.queryAllBuilds(jobName, callbackHandler(res));
});

// 这里不是指的上一次，而是现在正在运行的，或者是最近一次运行的
router.get('/:jobName/last', (req, res) => {
	const { jobName } = req.params;
	assert(jobName);

	buildManager.queryLastBuildInfo(jobName, callbackHandler(res));
});

// build Job，这里直接返回 queueId
router.post('/:jobName', (req, res) => {
	const { jobName } = req.params;
	assert(jobName);

	buildManager.buildJob(
		jobName,
		callbackHandler(res, result => {
			const { queueId } = result;

			// 暂时不知道是否可以 build
			// 如果还在队列中，则不会生成对应的 buildId

			res.json({ jobName, queueId });
		})
	);
});

// get build Job console
router.get('/:jobName/id/:buildId/console', (req, res) => {
	const { jobName, buildId } = req.params;
	assert(jobName && buildId);

	buildManager.queryJobConsole(jobName, buildId, callbackHandler(res));
});

// queryBuildInfo， 查询指定 buildId 的信息
router.get('/:jobName/id/:buildId/info', (req, res) => {
	const { jobName, buildId } = req.params;
	assert(jobName && buildId);

	buildManager.queryBuildInfo(jobName, buildId, callbackHandler(res));
});

// stop build Job
router.post('/:jobName/id/:buildId/stop', (req, res) => {
	const { jobName, buildId } = req.params;
	assert(jobName && buildId);

	buildManager.stopBuildJob(jobName, buildId, callbackHandler(res));
});

// delete build Job
router.delete('/:jobName/id/:buildId', (req, res) => {
	const { jobName, buildId } = req.params;
	assert(jobName && buildId);

	return buildManager.deleteBuildJob(jobName, buildId, callbackHandler(res));
});

module.exports = router;
