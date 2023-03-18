import { fail } from '@sveltejs/kit';
import { Game } from './game';

export const load = ({ cookies }) => {
	const game = new Game(cookies.get('codle'));

	return {
		guesses: game.guesses,
		answers: game.answers,
		answer: game.answers.length >= 6 ? game.answer : null
	};
};

export const actions = {
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('codle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		cookies.set('codle', game.toString());
	},

	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('codle'));

		const data = await request.formData();
		const guess = (data.getAll('guess'));

		if (!game.enter(guess)) {
			return fail(400, { badGuess: true });
		}

		cookies.set('codle', game.toString());
	},

	restart: async ({ cookies }) => {
		cookies.delete('codle');
	}
};
