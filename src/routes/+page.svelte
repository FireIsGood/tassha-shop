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
	import tassha_talking from '$lib/assets/mouth_combined.png';
	import tassha_talking_0 from '$lib/assets/spr_deco_shopwolf_talking_0.png';
	import tassha_talking_1 from '$lib/assets/spr_deco_shopwolf_talking_1.png';
	import tassha_talking_2 from '$lib/assets/spr_deco_shopwolf_talking_2.png';
	import tassha_talking_3 from '$lib/assets/spr_deco_shopwolf_talking_3.png';
	import tassha_talking_4 from '$lib/assets/spr_deco_shopwolf_talking_4.png';
	import tassha_hair_1 from '$lib/assets/spr_deco_shopwolf_hair_1.png';
	import tassha_hair_2 from '$lib/assets/spr_deco_shopwolf_hair_2.png';
	import tassha_hair_3 from '$lib/assets/spr_deco_shopwolf_hair_3.png';
	import tassha_hair_4 from '$lib/assets/spr_deco_shopwolf_hair_4.png';
	import emote_flower from '$lib/assets/flower_combined.png';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { random_list_item, typewriter } from '$lib/util';
	import { tasshaGreetings, tasshaQuotes, tasshaSecretQuotes } from '$lib/quotes';

	let patCenter: HTMLDivElement;

	// Dialog
	type DialogState = 'hidden' | 'writing' | 'done';
	let dialogState: DialogState = $state('hidden');
	let dialogText: string = $state('');
	let lastTalked: number = 0;

	function greetingQuote() {
		showDialog(random_list_item(tasshaGreetings));
	}

	function tryRandomQuote() {
		const talkedRecently = Date.now() - lastTalked < 2000;
		const isPatting = ear_state !== 'neutral';
		if (talkedRecently || isPatting || dialogState !== 'hidden') return;
		lastTalked = Date.now();

		// Evil
		if (Math.random() < 0.01) {
			showDialog(random_list_item(tasshaSecretQuotes));
			return;
		}

		// Random quote
		showDialog(random_list_item(tasshaQuotes));
	}

	function showDialog(text: string) {
		dialogState = 'writing';
		dialogText = text;
	}
	function hideDialog() {
		dialogState = 'hidden';
	}

	function dialogAction() {
		if (dialogState !== 'done') return;
		hideDialog();
	}

	// Tassha images
	type ClickState = 'clicking' | 'not-clicking';
	let click_state: ClickState = $state('not-clicking');

	type HoverState = 'hovering' | 'not-hovering';
	let hover_state: HoverState = $state('not-hovering');

	type FaceState = 'neutral' | 'anticipating' | 'happy' | 'comfy' | 'angry';
	let face_state: FaceState = $state('neutral');

	type EarState = 'neutral' | 'pat-center' | 'pat-left' | 'pat-right';
	let ear_state: EarState = $state('neutral');

	// Initially have no hair disruption
	let has_pat: boolean = $state(false);

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

	let blinking: boolean = $state(false);
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
		setInterval(tryRandomQuote, 9500);
		setTimeout(greetingQuote, 1500);
	});
</script>

<svelte:window onmouseup={unclickFace} onmousemove={onMouseMove} onblur={unhoverFace} />

<div class="shop">
	{#if dialogState === 'writing' || dialogState === 'done'}
		<!-- content here -->
		<div class="tassha-dialog" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
			<div class="dialog-name">Tassha, the Snowfur Wolf</div>
			<div
				class="dialog-textbox"
				class:dialog-done={dialogState === 'done'}
				onkeypress={dialogAction}
				onclick={dialogAction}
				role="button"
				tabindex="0"
			>
				&ZeroWidthSpace;<span
					class="dialog-text"
					in:typewriter={{ delay: 250, speed: 3 }}
					onintroend={() => {
						dialogState = 'done';
					}}>{dialogText}</span
				>
				{#if dialogState === 'done'}
					<div class="dialog-end-indicator">»</div>
				{/if}
			</div>
		</div>
	{/if}
	<div
		class="shop-npc tassha overlap"
		class:ears-neutral={ear_state === 'neutral'}
		class:face-anticipating={face_state === 'anticipating'}
		class:face-happy={face_state === 'happy'}
		class:face-comfy={face_state === 'comfy'}
		class:face-talking={dialogState === 'writing'}
		class:has-pat={has_pat}
		class:ears-pat-active={ear_state !== 'neutral'}
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
			src={tassha_talking}
			class="mouth sprite-sheet mouth-talking-sprite"
			draggable="false"
			alt=""
		/>
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
		{#if ear_state !== 'neutral'}
			<img
				src={emote_flower}
				in:fade={{ duration: 250 }}
				out:fade={{ delay: 800, duration: 250 }}
				class="emote emote-flower sprite-sheet"
				draggable="false"
				alt=""
			/>
		{/if}
	</div>
	<div class="shop-main">
		<div class="shop-background">
			<div class="shop-scroll"></div>
		</div>
		<section class="shop-items">
			<h1>Tassha Shop</h1>
			<p>Tassha has nothing...</p>
		</section>
	</div>
	<div class="shop-footer">
		<div class="shop-background">
			<div class="shop-scroll"></div>
		</div>
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
		grid-template-columns: minmax(auto, min(max(400px, 50vw), 500px)) auto;
		grid-template-rows: auto minmax(auto, 1fr);
		grid-template-areas:
			'tassha items'
			'footer footer';
		overflow: clip;
	}
	.shop-npc {
		z-index: 1;
	}
	.shop-main {
		position: relative;
		grid-area: items;
		z-index: 2;
		margin-left: -1px;
		padding-left: 1px;
		padding-top: 85px;
		padding-left: 100px;

		.shop-items {
			padding: 0.5rem 1rem;
			color: #efefef;
		}
	}
	.shop-footer {
		position: relative;
		grid-area: footer;
		min-height: 32px;
		max-height: 540px;
		padding-left: 30px;
		display: flex;
		flex-direction: column;
		color: #efefef;

		.shop-background {
			left: -70px;
			top: -60px;
		}

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

	.shop-scroll {
		position: absolute;
		background-image: url('$lib/assets/spr_store_background2_0.png');
		background-repeat: no-repeat;
		width: 100px;
		height: 600px;
		top: -7px;
	}

	.shop-background {
		position: absolute;
		z-index: -1;
		inset: 0;
		height: 590px;
		margin-block: 5px;
		border-top: 2px solid #000;
		border-bottom: 2px solid #000;
		background:
			url('$lib/assets/spr_store_background3_0.png') repeat no-repeat,
			url('$lib/assets/spr_store_background3_1.png') bottom left repeat no-repeat,
			url('$lib/assets/spr_store_background4_0.png'),
			#1a1919;
	}

	@media (width < 600px) {
		.shop {
			grid-template-columns: auto;
			grid-template-rows: auto auto 1fr;
			grid-template-areas:
				'tassha'
				'items'
				'footer';
			overflow: unset;
		}
		.shop-items {
			margin-left: unset;
			padding-left: unset;
			margin-top: -40px;
			padding-top: 40px;
		}
		.shop-footer {
			height: 600px;
			margin-top: -12px;
			padding-top: 12px;

			.shop-background {
				top: 60px;
			}

			footer {
				flex-direction: column;
				text-align: center;
				row-gap: 0.25rem;
			}
		}
	}

	.overlap {
		position: relative;
		& > :where(img) {
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

	.tassha-dialog {
		position: absolute;
		position-anchor: --tassha-dialog;
		position-area: inline-end block-end;
		top: -100px;
		left: 20px;
		z-index: 20;
		font-size: 1.2rem;
		font-weight: 600;
		color: #c6cde2;

		.dialog-name {
			margin-left: 1.5rem;
			margin-bottom: 0.5rem;
			text-shadow:
				-2px 0 1px #000,
				2px 0 1px #000,
				0 2px 1px #000,
				0 -2px 1px #000,
				-2px -2px 1px #000,
				2px -2px 1px #000,
				-2px 2px 1px #000,
				2px 2px 1px #000;
		}

		.dialog-textbox {
			background-color: #000;
			border: 2px solid #5f7dc2;
			border-radius: 2px;
			padding: 1rem 1.5rem;
			min-height: 5em;
			min-width: 35em;
			max-width: 100%;

			&.dialog-done {
				cursor: pointer;
			}
		}

		.dialog-end-indicator {
			position: absolute;
			right: 0;
			bottom: 0;
			color: #666;
			padding-right: 0.75rem;
			padding-bottom: 0.5rem;
			user-select: none;
			animation: blink-fade -800ms 1600ms steps(2, jump-none) infinite;
		}
	}

	@keyframes blink-fade {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	#face-area {
		position: absolute;
		inset: 7% 27% 55% 38%;
		border-radius: 10px;
		z-index: 10;
		anchor-name: --tassha-dialog;

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
	.emote {
		width: 125px;
		height: 125px;
		z-index: 6;
		left: 36%;
		top: -7%;
		animation: spritesheet 600ms steps(2, jump-none) infinite;
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

	.face-talking {
		.mouth-talking-sprite {
			opacity: 1;
			animation: spritesheet 1200ms steps(5, jump-none) infinite;
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
