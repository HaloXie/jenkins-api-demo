import express from 'express';
import JobManager from '../controllers/jobController';
import jenkinsInstance from '../factories/jenkins';

const router = express.Router();
const jobManager = new JobManager(jenkinsInstance);

router.post('/:id/enable', (req, res) => {
	jobManager.enableJob(req.params.id);
});
router.post('/:id/disable', (req, res) => {
	jobManager.queryJob(req.params.id);
});
router.post('/', (req, res) => {
	jobManager.createJob();
});

router.get('/', (req, res) => {
	jobManager.queryJobs();
});

router.get('/:id', (req, res) => {
	jobManager.queryJob(req.params.id);
});

router.put('/', (req, res) => {
	jobManager.updateJob();
});

router.delete('/', (req, res) => {
	jobManager.deleteJob();
});
