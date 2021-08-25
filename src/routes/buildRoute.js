const express = require('express');
const assert = require('assert');

const buildManager = require('../controllers/buildController');
const { callbackHandler } = require('../utils/callback');

const router = express.Router();

const tempDB = new Map();

// build Job
router.post('/:name', (req, res) => {
	const jobName = req.params.name;
	assert(jobName);

	buildManager.buildJob(
		jobName,
		callbackHandler(res, result => {
			const queueId = result.queueId;

			buildManager.buildJob(
				jobName,
				queueId,
				callbackHandler(res, data => {
					const buildId = data.executable.number;
					assert(buildId);

					tempDB.set((jobName, { jobName, queueId, buildId }));
					res.json({ buildId });
				})
			);
		})
	);
});

// stop build Job
router.post('/:name/disable', (req, res) => {
	const jobName = req.params.name;
	assert(jobName);

	const jobEntity = tempDB.get(jobName);
	assert(jobEntity);

	buildManager.stopBuildJob(jobEntity.jobName, jobEntity.buildId, callbackHandler(res));
});

// get build job info
router.get('/:name/info', (req, res) => {
	const jobName = req.params.name;
	assert(jobName);

	const jobEntity = tempDB.get(jobName);
	assert(jobEntity);

	buildManager.queryBuildInfo(jobEntity.jobName, jobEntity.buildId, callbackHandler(res));
});

// get build Job console
router.get('/:name/console', (req, res) => {
	const jobName = req.params.name;
	assert(jobName);

	const jobEntity = tempDB.get(jobName);
	assert(jobEntity);

	buildManager.queryJobConsole(jobEntity.jobName, jobEntity.buildId, callbackHandler(res));
});

module.exports = router;
