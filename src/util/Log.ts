import c from 'ansi-colors';
import { YAMLException } from 'js-yaml';
import HumanPath from './HumanPath.js';

function error(yamlException: YAMLException): void;
function error(...messages: unknown[]): void;
function error(...messages: unknown[]) {
	if (messages.length === 1) {
		const [ex] = messages;
		if (ex instanceof YAMLException) {
			const msg1 = `${ex.reason} in ${HumanPath(ex.mark.name)}`;
			const msg2 = `(${ex.mark.line + 1}, ${ex.mark.column + 1}):\n`;
			const msg = msg1 + msg2 + ex.mark.snippet;
			error(msg);
			return;
		}
	}

	console.error(c.redBright('✖'), ...messages);
}

const Log = {
	debug: (...messages: unknown[]) => {
		if (Log.verbose) {
			console.debug(c.gray('⚙'), ...messages);
		}
	},
	error,
	info: (...messages: unknown[]) => {
		console.log(c.blueBright('ℹ'), ...messages);
	},
	verbose: false,
	warn: (...messages: unknown[]) => {
		console.warn(c.yellowBright('⚠'), ...messages);
	}
};

export default Log;
