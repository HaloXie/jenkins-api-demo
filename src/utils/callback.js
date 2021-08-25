/**
 *
 * @param {*} res
 * @param {*} successFn (result) => void
 * @returns void
 */
const callbackHandler = (res, successFn) => (error, result) => {
	if (error) {
		console.error(error);
		return res.json({
			error,
			success: false,
		});
	}

	if (successFn) {
		return successFn(result);
	}

	return res.json(result);
};

module.exports = {
	callbackHandler,
};
