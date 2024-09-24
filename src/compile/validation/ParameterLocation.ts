type ParameterLocation = 'cookie' | 'header' | 'path' | 'query';
export default ParameterLocation;

export function isParameterLocation(o: string): o is ParameterLocation {
	return ['path', 'query', 'header', 'cookie'].includes(o);
}
