export function typewriter(
	node: HTMLElement,
	{ delay = 0, speed = 1 }: { delay?: number; speed?: number }
) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		delay,
		duration,
		tick: (t: number) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

export function random_list_item<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}
