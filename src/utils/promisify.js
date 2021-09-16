const promisify = function (fn) {
	return function (...args) {
		return new Promise(function (resolve) {
			fn(...args, function (error, result) {
				if (error) {
					console.error(error);
					resolve({ error, success: false });
				}
				resolve({ result, success: true });
			});
		});
	};
};

module.exports = {
	promisify,
};
