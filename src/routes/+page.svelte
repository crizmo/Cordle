<script>
	import { confetti } from "@neoconfetti/svelte";
	import { enhance } from "$app/forms";

	import { reduced_motion } from "./reduced-motion";
	import Swal from "sweetalert2";

	import { howtoplay } from "./howtoplay.js";

	import './game.css'

	export let data;

	export let form;

	$: won = data.answers.at(-1) === "xxxxx";
	$: i = won ? -1 : data.answers.length;
	$: submittable = data.guesses[i]?.length === 5;
	let classnames;
	let description;
	console.log(data);

	$: {
		classnames = {};
		description = {};

		data.answers.forEach((answer, i) => {
			const guess = data.guesses[i];

			for (let i = 0; i < 5; i += 1) {
				const letter = guess[i];

				if (answer[i] === "x") {
					classnames[letter] = "exact";
					description[letter] = "correct";
				} else if (!classnames[letter]) {
					classnames[letter] =
						answer[i] === "c" ? "close" : "missing";
					description[letter] =
						answer[i] === "c" ? "present" : "absent";
				}
			}
		});
	}

	function update(event) {
		const guess = data.guesses[i];
		const key = event.target.getAttribute("data-key");

		if (key === "backspace") {
			data.guesses[i] = guess.slice(0, -1);
			if (form?.badGuess) form.badGuess = false;
		} else if (guess.length < 5) {
			data.guesses[i] += key;
		}
	}

	function share() {
		let answers = data.answers;
		let copycode;
		answers.forEach(function (answer) {
			if (answer.includes("_")) {
				answer = answer.replace(/_/g, "⬛");
			}
			if (answer.includes("c")) {
				answer = answer.replace(/c/g, "🟨");
			}
			if (answer.includes("x")) {
				answer = answer.replace(/x/g, "🟩");
			}
			if (copycode === undefined) {
				copycode = "";
			}
			copycode = copycode + answer + "\n";
		});

		let tries = data.answers.length;
		console.log("Tries: " + tries);

		console.log("Cordle : " + tries + "/6 \n\n" + copycode);
		let copyText = "Cordle : " + tries + "/6 \n\n" + copycode;

		navigator.clipboard.writeText(copyText).then(
			function () {
				Swal.fire({
					html: `<p style="font-size: 1rem; color: #3a3a3c;
					margin: 0; padding: 0; text-align: center; 
				">Copied to clipboard!</p>`,
					timer: 2000,
					position: "top",
					showConfirmButton: false,
					width: "15rem",
				});
			},
			function () {
				Swal.fire({
					html: `<p style="font-size: 1rem; color: #3a3a3c;
					margin: 0; padding: 0; text-align: center;
				">Failed to copy to clipboard!</p>`,
					timer: 2000,
					position: "top",
					showConfirmButton: false,
					width: "15rem",

				});
			}
		);
	}

	function keydown(event) {
		if (event.metaKey) return;

		document
			.querySelector(`[data-key="${event.key}" i]`)
			?.dispatchEvent(new MouseEvent("click", { cancelable: true }));
	}
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
	<title>Cordle</title>
	<meta name="description" content="Wordle but with computer related words" />
</svelte:head>

<div style="width: 100%; height: 5rem; position: relative;">
	<h1
		style="text-align: center; color: white; font-size: 2rem; font-weight: 700; position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%);
			font-family: 'Monospace', monospace; font-weight: 700; letter-spacing: 0.1rem; text-transform: uppercase;
		"
	>
		Cordle
	</h1>
	<button
		style="font-size: 1rem; background: none; border: none; cursor: pointer; position: absolute; top: 50%; right: 1rem; transform: translateY(-50%);"
		on:click={() => {
			Swal.fire({
				title: "How to play",
				html: `${howtoplay}`,
				confirmButtonText: "Got it!",
				confirmButtonColor: "#3a3a3c",
			});
		}}
	>
		<img
			src="https://img.icons8.com/ios/50/000000/unverified-account.png"
			style="width: 2rem; height: 2rem; filter: invert(1);"
			alt="info"
		/>
	</button>
</div>
<hr
	style="width: 100%; margin: 0; border: 0; border-bottom: 1px solid #565758;"
/>

<form
	method="POST"
	action="?/enter"
	use:enhance={() => {
		return ({ update }) => {
			update({ reset: false });
		};
	}}
>
	<div class="grid" class:playing={!won} class:bad-guess={form?.badGuess}>
		{#each Array(6) as _, row}
			{@const current = row === i}
			<h2 class="visually-hidden">Row {row + 1}</h2>
			<div class="row" class:current>
				{#each Array(5) as _, column}
					{@const answer = data.answers[row]?.[column]}
					{@const value = data.guesses[row]?.[column] ?? ""}
					{@const selected =
						current && column === data.guesses[row].length}
					{@const exact = answer === "x"}
					{@const close = answer === "c"}
					{@const missing = answer === "_"}
					<div
						class="letter"
						class:exact
						class:close
						class:missing
						class:selected
					>
						{value}
						<span class="visually-hidden">
							{#if exact}
								(correct)
							{:else if close}
								(present)
							{:else if missing}
								(absent)
							{:else}
								empty
							{/if}
						</span>
						<input
							name="guess"
							disabled={!current}
							type="hidden"
							{value}
						/>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="controls">
		{#if won || data.answers.length >= 6}
			{#if !won && data.answer}
				<p
					style="color: white; font-size: 1.5rem; margin-bottom: 1rem;"
				>
					The Answer was "{data.answer}"
				</p>
			{/if}
			<button
				data-key="enter"
				class="restart selected"
				formaction="?/restart"
			>
				{won ? "you won :)" : `game over :(`} play again?
			</button>

			<button class="share selected" on:click={share}> Share </button>

			<div class="footer" style="position: relative; margin-top: 2rem;">
				<p style="color: white; font-size: 1rem; margin-bottom: 1rem;">
					Made by <a href="https://github.com/crizmo" style="color: #4f9948;">kurizu 🐱 </a> & <a href="https://github.com/ceasonal"> ceasonal 🦥</a>
				</p>
			</div>
		{:else}
			<div class="keyboard">
				<button
					data-key="enter"
					class:selected={submittable}
					disabled={!submittable}>enter</button
				>

				<button
					on:click|preventDefault={update}
					data-key="backspace"
					formaction="?/update"
					name="key"
					value="backspace"
				>
					back
				</button>

				{#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as row}
					<div class="row">
						{#each row as letter}
							<button
								on:click|preventDefault={update}
								data-key={letter}
								class={classnames[letter]}
								disabled={data.guesses[i].length === 5}
								formaction="?/update"
								name="key"
								value={letter}
								aria-label="{letter} {description[letter] ||
									''}"
							>
								{letter}
							</button>
						{/each}
					</div>
				{/each}
			</div>
			<div class="footer" style="position: relative; margin-top: 2rem;">
				<p style="color: white; font-size: 1rem; margin-bottom: 1rem;">
					Made by <a href="https://github.com/crizmo" style="color: #4f9948;">kurizu 🐱 </a> & <a href="https://github.com/ceasonal"> ceasonal 🦥</a>
				</p>
			</div>
		{/if}
	</div>

</form>

{#if won}
	<div
		style="position: absolute; left: 50%; top: 30%"
		use:confetti={{
			particleCount: $reduced_motion ? 0 : undefined,
			force: 0.7,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ["#f7da21", "#6aaa64", "#fff"],
		}}
	/>
{/if}