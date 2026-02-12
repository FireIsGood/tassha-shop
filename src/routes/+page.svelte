<script lang="ts">
	import tassha_base from '$lib/assets/spr_deco_shopwolf_base_0.png';
	import tassha_ears_0 from '$lib/assets/spr_deco_shopwolf_ears_0.png';
	import tassha_ears_1 from '$lib/assets/spr_deco_shopwolf_ears_1.png';
	import tassha_ears_2 from '$lib/assets/spr_deco_shopwolf_ears_2.png'; // Unused sprite?
	import tassha_ears_3 from '$lib/assets/spr_deco_shopwolf_ears_3.png';
	import tassha_faceneutral from '$lib/assets/face_neutral_combined.png';
	import tassha_facehappy from '$lib/assets/face_happy_combined.png';
	import tassha_facecomfy from '$lib/assets/face_comfy_combined.png';
	import tassha_tails from '$lib/assets/tails_combined.png';
	import tassha_talking_0 from '$lib/assets/spr_deco_shopwolf_talking_0.png';
	import tassha_talking_1 from '$lib/assets/spr_deco_shopwolf_talking_1.png';
	import tassha_talking_2 from '$lib/assets/spr_deco_shopwolf_talking_2.png';
	import tassha_talking_3 from '$lib/assets/spr_deco_shopwolf_talking_3.png';
	import tassha_talking_4 from '$lib/assets/spr_deco_shopwolf_talking_4.png';
	import tassha_hair_1 from '$lib/assets/spr_deco_shopwolf_hair_1.png';
	import tassha_hair_2 from '$lib/assets/spr_deco_shopwolf_hair_2.png';
	import tassha_hair_3 from '$lib/assets/spr_deco_shopwolf_hair_3.png';
	import tassha_hair_4 from '$lib/assets/spr_deco_shopwolf_hair_4.png';
	import { onMount } from 'svelte';

	let patCenter: HTMLDivElement;

	type ClickState = 'clicking' | 'not-clicking';
	let click_state: ClickState = 'not-clicking';

	type HoverState = 'hovering' | 'not-hovering';
	let hover_state: HoverState = 'not-hovering';

	type FaceState = 'neutral' | 'anticipating' | 'happy' | 'comfy' | 'angry';
	let face_state: FaceState = 'neutral';

	type EarState = 'neutral' | 'pat-center' | 'pat-left' | 'pat-right';
	let ear_state: EarState = 'neutral';

	// Initially have no hair disruption
	let has_pat: boolean = false;

	function hoverFace() {
		hover_state = 'hovering';

		if (click_state === 'not-clicking') {
			face_state = 'happy';
		}
	}

	function unhoverFace() {
		hover_state = 'not-hovering';

		if (click_state === 'not-clicking') {
			face_state = 'neutral';
		}
	}

	function clickFace(e: MouseEvent) {
		click_state = 'clicking';
		has_pat = true;
		face_state = 'comfy';
		updateEarState(e);
	}

	function unclickFace() {
		click_state = 'not-clicking';
		if (hover_state === 'hovering') {
			face_state = 'happy';
		} else {
			face_state = 'neutral';
		}
		ear_state = 'neutral';
	}

	function onMouseMove(e: MouseEvent) {
		if (click_state === 'not-clicking') return;
		updateEarState(e);
	}

	function updateEarState(e: MouseEvent) {
		type PatSide = 'left' | 'center' | 'right';
		const patBounds = patCenter.getBoundingClientRect();
		const patState: PatSide =
			e.clientX > patBounds.left && e.clientX < patBounds.right
				? 'center'
				: e.clientX < patBounds.left
					? 'left'
					: 'right';

		switch (patState) {
			case 'center':
				ear_state = 'pat-center';
				break;
			case 'left':
				ear_state = 'pat-left';
				break;
			case 'right':
				ear_state = 'pat-right';
				break;
		}
	}

	let blinking: boolean = false;
	function blink() {
		if (blinking || face_state !== 'neutral') return;

		blinking = true;
		setTimeout(() => {
			blinking = false;
		}, 800);
	}

	// she's so happy
	function anticipate() {
		if (face_state === 'neutral') {
			face_state = 'anticipating';
		}
		setTimeout(() => {
			if (face_state === 'anticipating') {
				face_state = 'neutral';
			}
		}, 1800);
	}

	onMount(() => {
		setInterval(blink, 2800);
		setInterval(anticipate, 6200);
	});
</script>

<svelte:window onmouseup={unclickFace} onmousemove={onMouseMove} onblur={unhoverFace} />

<div class="shop">
	<div
		class="tassha overlap"
		class:ears-neutral={ear_state === 'neutral'}
		class:face-anticipating={face_state === 'anticipating'}
		class:face-happy={face_state === 'happy'}
		class:face-comfy={face_state === 'comfy'}
		class:has-pat={has_pat}
		class:ears-pat-center={ear_state === 'pat-center'}
		class:ears-pat-left={ear_state === 'pat-left'}
		class:ears-pat-right={ear_state === 'pat-right'}
	>
		<div
			id="face-area"
			role="button"
			tabindex="0"
			onmouseover={hoverFace}
			onfocus={hoverFace}
			onmouseleave={unhoverFace}
			onmousedown={clickFace}
		>
			<div id="pat-center" bind:this={patCenter}></div>
		</div>
		<img src={tassha_base} class="base" draggable="false" alt="" />
		<img src={tassha_ears_0} class="ears ears-neutral-sprite" draggable="false" alt="" />
		<img src={tassha_ears_1} class="ears ears-pat ears-pat-left-sprite" draggable="false" alt="" />
		<img
			src={tassha_ears_0}
			class="ears ears-pat ears-pat-center-sprite"
			draggable="false"
			alt=""
		/>
		<img src={tassha_ears_3} class="ears ears-pat ears-pat-right-sprite" draggable="false" alt="" />
		<img src={tassha_hair_1} class="hair hair-left-sprite" draggable="false" alt="" />
		<img src={tassha_hair_3} class="hair hair-right-sprite" draggable="false" alt="" />
		<img src={tassha_hair_2} class="hair hair-center-sprite" draggable="false" alt="" />
		<img src={tassha_hair_4} class="hair hair-neutral-sprite" draggable="false" alt="" />
		<img src={tassha_talking_4} class="mouth mouth-talking-sprite-4" draggable="false" alt="" />
		<img
			src={tassha_faceneutral}
			class="face face-neutral-sprite sprite-sheet"
			class:blink={blinking}
			alt=""
			draggable="false"
		/>
		<img
			src={tassha_facehappy}
			class="face face-happy-sprite sprite-sheet"
			alt=""
			draggable="false"
		/>
		<img
			src={tassha_facecomfy}
			class="face face-comfy-sprite sprite-sheet"
			alt=""
			draggable="false"
		/>
		<img src={tassha_tails} class="tail sprite-sheet" draggable="false" alt="" />
	</div>
	<div class="shop-items">
		<h1>Tassha Shop</h1>
		<p>Tassha has nothing...</p>
	</div>
	<div class="shop-footer">
		<footer>
			<p>
				Site by <a href="https://fireis.dev" target="_blank">FireIsGood</a>
			</p>
			<p>Rabbit &amp; Steel is &copy;2017 by MINO_DEV</p>
			<p><a href="https://github.com/FireIsGood/tassha-shop" target="_blank">Source Code</a></p>
		</footer>
	</div>
</div>

<style>
	.shop {
		padding-top: 40px;
		display: grid;
		grid-template-columns: minmax(auto, min(35vw, 734px)) auto;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'tassha items'
			'footer footer';
	}
	.shop-items {
		grid-area: items;
		z-index: 2;
		margin-left: -1px;
		padding-left: 1px;
		background-color: #1a1919;
		border: 4px solid #000;
		padding: 1rem 1.5rem;
		color: #efefef;
	}
	.shop-footer {
		grid-area: footer;
		min-height: 32px;
		margin-top: -40px;
		padding-top: 40px;
		display: flex;
		flex-direction: column;
		z-index: 1;
		background-color: #131212;
		border: 4px solid #000;
		color: #efefef;

		footer {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: auto;
			padding: 0.75rem;
			color: #6a6a6a;

			p {
				margin: 0;
				font-size: 1rem;
				opacity: 0.4;
				transition: opacity 100ms ease;

				&:hover {
					opacity: 1;
				}
			}

			a {
				color: #6a6a56;
				text-decoration: 1px underline #6a6a5640;

				&:hover {
					color: #8b8b76;
					text-decoration: 1px underline;
				}
			}
		}
	}

	@media (width < 600px) {
		.shop {
			grid-template-columns: auto;
			grid-template-rows: auto auto 1fr;
			grid-template-areas:
				'tassha'
				'items'
				'footer';
		}
		.shop-items {
			margin-left: unset;
			padding-left: unset;
			margin-top: -40px;
			padding-top: 40px;
		}
		.shop-footer {
			margin-top: -12px;
			padding-top: 12px;

			footer {
				flex-direction: column;
				text-align: center;
				row-gap: 0.25rem;
			}
		}
	}

	.overlap {
		position: relative;
		& > * {
			position: absolute;
			inset: 0;
		}
	}

	.sprite-sheet {
		height: 100%;
		object-fit: cover;
		object-position: 0 0;
	}

	.tassha {
		grid-area: tassha;
		aspect-ratio: 734 / 818;
		max-width: 734px;
		max-height: 818px;

		user-select: none;
	}

	#face-area {
		inset: 7% 27% 55% 38%;
		border-radius: 10px;
		z-index: 10;

		/* Debug colors */
		/* background-color: #44f4; */
		/* outline: 2px solid #face; */
	}

	#pat-center {
		position: absolute;
		inset: 0 40%;

		/* Debug colors */
		/* background-color: #44f4; */
		/* outline: 2px solid #afce; */
	}

	.base {
		z-index: 1;
		padding-right: 1px;
	}
	.ears {
		z-index: 2;
	}
	.face {
		z-index: 3;
		opacity: 0;
	}
	.mouth {
		z-index: 4;
		opacity: 0;
	}
	.ears-pat {
		opacity: 0;
	}
	.hair {
		z-index: 5;
		opacity: 0;
	}

	/* Face states */
	.face-anticipating {
		.mouth-talking-sprite-4 {
			opacity: 1;
		}
		.tail {
			animation-play-state: paused;
		}
	}

	.face-happy {
		.face-neutral-sprite {
			opacity: 0;
		}
		.face-happy-sprite {
			opacity: 1;
			animation: spritesheet 800ms steps(3, jump-none) infinite;
		}
		.tail {
			animation-duration: 400ms;
		}
	}

	.face-comfy {
		.face-neutral-sprite {
			opacity: 0;
		}
		.face-comfy-sprite {
			opacity: 1;
			animation: spritesheet 800ms steps(3, jump-none) infinite;
		}
		.tail {
			animation-duration: 400ms;
		}
	}

	/* Pat states */
	.has-pat {
		.hair-neutral-sprite {
			opacity: 1;
		}
	}
	.ears-pat-center {
		.ears-neutral-sprite {
			opacity: 0;
		}
		.ears-pat-center-sprite {
			opacity: 1;
		}
		.hair-neutral-sprite {
			opacity: 0;
		}
		.hair-center-sprite {
			opacity: 1;
		}
	}
	.ears-pat-left {
		.ears-neutral-sprite {
			opacity: 0;
		}
		.ears-pat-left-sprite {
			opacity: 1;
		}
		.hair-neutral-sprite {
			opacity: 0;
		}
		.hair-left-sprite {
			opacity: 1;
		}
	}
	.ears-pat-right {
		.ears-neutral-sprite {
			opacity: 0;
		}
		.ears-pat-right-sprite {
			opacity: 1;
		}
		.hair-neutral-sprite {
			opacity: 0;
		}
		.hair-right-sprite {
			opacity: 1;
		}
	}

	/* Base face states */
	.face-neutral-sprite {
		opacity: 1;
		&.blink {
			animation: spritesheet 400ms steps(3, jump-none) alternate infinite;
		}
	}

	/* Base tail states */
	.tail {
		z-index: 0;

		animation: spritesheet 1200ms steps(4, jump-none) infinite;
	}

	@keyframes spritesheet {
		from {
			object-position: 0 0;
		}
		to {
			object-position: 100% 0;
		}
	}
</style>
