import { base } from '$app/paths';

export class NavLink {
	public href: string;

	constructor(
		public label: string,
		href: string,
		public isExternal: boolean = false,
		public isDisabled: boolean = false
	) {
		this.href = isExternal ? href : `${base}${href}`;
	}
}

export class NavDropdown {
	constructor(
		public label: string,
		public children: NavLink[]
	) {}
}

export class NavigationSeparator {
	constructor(public afterSeparator: string = '') {}
}

export function isNavigationActive(href: string, currentPath: string) {
	// if currentPath is a subpath of href, then it is active
	return currentPath.startsWith(href);
}

type NavigationEntry = NavLink | NavDropdown | NavigationSeparator;

export const navigationEntries = [
	new NavLink('Penyusun PRS', '/prs'),
	new NavLink('Edit Data', '/edit-data'),
	new NavLink('About', '/about'),
	new NavigationSeparator('Contribute to the project'),
	new NavLink('GitHub', 'https://github.com/NathanAdhitya/petra-prs-helper', true),
	new NavLink('Send a Feedback', 'https://forms.gle/ZWfgFMc3GWtRAb2VA', true)
] as const as NavigationEntry[];
