type ParameterLocation = 'cookie' | 'header' | 'path' | 'query';
export default ParameterLocation;

export const Locations: readonly ParameterLocation[] = [
	'cookie',
	'header',
	'path',
	'query'
];

export function isParameterLocation(o: string): o is ParameterLocation {
	return (Locations as readonly string[]).includes(o);
}
